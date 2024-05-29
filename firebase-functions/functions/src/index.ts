/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
// import { collection, getDocs, getFirestore } from "firebase/firestore";
import {firestore} from "firebase-admin";
import {Gate, GateStatus} from "./models/gate";
import {updateGateStatusIfNecessary} from "./services/gate-status";
import {SOLITUDE_GATES} from "./constants.ts/solitude-gates";

// The Firebase Admin SDK to access Firestore.
import {initializeApp} from "firebase-admin/app";
// const firebaseConfig = require("../google-services.json");


initializeApp();

// Initialize Cloud Firestore and get a reference to the service
// const db = getFirestore();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


const checkForRopeDropsHelper = async () => {
  const res = await fetch("https://mtnpowder.com/feed/65/lifts", {
    "headers": {
      "accept": "*/*",
    },
    "body": null,
    "method": "GET",
  });

  const wholeMountain = await res.json();
  const buildResponse: string[] = [];

  const promises: Promise<any>[] = [];

  SOLITUDE_GATES.forEach((gate) => {
    const gatePromise = firestore().collection("gateStatus").where("gateName", "==", gate.gateName).get().then((result) => {
      // If we don't have this in the database, add it
      if (result.docs.length === 0) {
        firestore().collection("gateStatus").add({
          gateName: gate.gateName,
          lastOpenDate: new Date(),
          status: GateStatus.Close,
        });
      }
      result.docs.forEach((x) => {
        const gateResult = x.data();
        // Status that we have in the DB
        const oldStatus: Gate = {
          gateInfo: gate,
          status: gateResult.status,
          lastOpenDate: gateResult.lastOpenDate,
        };
        // Find the gate in the wholeMountain response
        const gateFromApi = wholeMountain.find((x: any) => x.Name === gate.lift).Trails.find((x: any) => x.Name === gate.trailName);
        const newStatus: Gate = {
          gateInfo: gate,
          status: gateFromApi.Status,
          lastOpenDate: new Date(),
        };
        buildResponse.push(`DB says ${gate.gateName} is ${gateResult.status}`);
        buildResponse.push(`DB says ${gate.gateName} is ${gateFromApi.status}`);
        updateGateStatusIfNecessary(newStatus, oldStatus);
      });
    });
    promises.push(gatePromise);
  });
  return Promise.all(promises);
};

export const checkForRopeDrops = onRequest(async (request, response) => {
  await checkForRopeDropsHelper();
  response.send("I'm all set");
});
// Run repeatedly throughout the day and check for rope drops
export const checkForRopeDropsScheduled = onSchedule("0 13-20 * * *", async (event) => {
  await checkForRopeDropsHelper();
  return Promise.resolve();
});

// Run once a day to record how much fresh snow there is for the day
export const getTodaysSnowfall = onSchedule("0 13 * * *", async (event) => {
  const res = await fetch("https://mtnpowder.com/feed", {
    "headers": {
      "accept": "*/*",
    },
    "body": null,
    "method": "GET",
  });
  const allMountains = await res.json();
  const solitude = allMountains.Resorts.find((resort: any) => resort.Name === "Solitude");
  const todaySnowTotal = solitude.SnowReport.MidMountainArea.Last24HoursIn;
  firestore().collection("solitudeDailySnow").add({
    totalInches: parseInt(todaySnowTotal),
    date: new Date(),
  });
  return;
});

// response.send(`The Buckeye gate is ${buckeyeGate.Status}`);
