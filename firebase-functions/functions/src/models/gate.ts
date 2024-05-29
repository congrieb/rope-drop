export enum GateStatus {
    Open = "Open",
    Close = "Closed",
    Pending = "Pending Avalanche Mitigation"
}

export interface Gate {
    gateInfo: GateInfo;
    status: GateStatus;
    lastOpenDate: Date;
}

export interface GateInfo {
    trailName: string;
    gateName: string;
    lift: string;
}
