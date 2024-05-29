import {FieldPath} from "firebase-admin/firestore";
import {Gate, GateStatus} from "../models/gate";
import {firestore, messaging} from "firebase-admin";
import {ROPE_DROP_SNOWFALL_THRESHOLD} from "../constants.ts/rope-drop-criteria";

export const updateGateStatusIfNecessary =
    (newStatus: Gate, oldStatus: Gate) => {
      // If the latest status is different from the status we had in the DB.
      // Lets update the DB accordingly
      if (newStatus.status !== oldStatus.status) {
        firestore().collection("gateStatus")
          .where(new FieldPath("gateName"), "==", newStatus.gateInfo.gateName).get()
          .then(async (doc) => {
            // Get the total snowfall since last open
            let totalSnowfall = 0;
            await firestore().collection("solitudeDailySnow")
              .where("date", ">", oldStatus.lastOpenDate)
              .where("date", "<", newStatus.lastOpenDate).get().then((result) => {
                result.forEach((day) => {
                  totalSnowfall += parseInt(day.data().totalInches);
                });
              });
            doc.forEach((x) => {
              x.ref.update({status: newStatus.status, lastOpenDate: isRopeDrop(newStatus, totalSnowfall) ? newStatus.lastOpenDate : oldStatus.lastOpenDate});
            });
            // Send a notification if this was a rope drop and I am subscrived to updates for this gate
            if (isRopeDrop(newStatus, totalSnowfall) && await isSubscribed(newStatus)) {
              const message = {
                notification: {
                  "title": "Rope Drop!",
                  "body": `${newStatus.gateInfo.gateName} gate is now ${newStatus.status} with ${totalSnowfall} inches of fresh`,
                },
                token: "eQpCbqLlT2OD_OakUYAEtr:APA91bGQ8gAX_gYbQoX7JjkFfWkut3A7hcBEaz-U11ke6RFasE4yzZk0wiEp5A0oUDs2oM9K_S6k6o0Sx4jZo0ckd7u_fB0f5trQxgBpj34dN7AWqn44RBfbeewCn8y2-EEUwlbfXmt5",
              };
              // TODO: Switch this to using the "topics" feature for messaging, rather than targeting a device
              messaging().send(message).then((x) => console.log(`Successfully sent messgage: ${x}`));
            }
          });
      }


      return;
    };

const isRopeDrop = (newStatus: Gate, totalSnowfall: number) => (newStatus.status === GateStatus.Open && totalSnowfall >= ROPE_DROP_SNOWFALL_THRESHOLD);
const isSubscribed = async (gate: Gate) => {
  const subDoc = await firestore().collection("subs").doc("cgrieb9@gmail.com").get();
  const doc = subDoc.data();
  if (doc) {
    return doc[gate.gateInfo.gateName];
  } else {
    return false;
  }
};
