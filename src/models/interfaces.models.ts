import { ContentType, Roles, Status } from "../utils/constants.utils";

export interface IMessage {
    id: string;
    authorRole: Roles;
    content: {
        contentType: ContentType;
        parts: string[];
        cid: string
    };
    status: Status;
    timeStamp: Date;
}

export interface IConversation {
    _id: string;
    messages: IMessage[];
}
export interface IUser {
    userId: string;
    walletAddress: string;
    conversations: IConversation[];
}

export interface IChatRequest {
    userId?: string,
    messageContent: {
        content_type: ContentType,
        parts: [String]
    },
    conversationId: string,
    timestamp: Date,
    isLoggedIn: boolean,
    authorRole: Roles
}

export interface ICreatorWorkMetadata {
    creatorId: string,
    nameOfWork: string,
    dateOfCreation: Date,
    medium: "Film" | "Photo" | "Music" | "AI" | "Art" | "Other",
    alternativeMedium?: string,
    licenseType: "CC BY" | "CC BY-SA" | "CC-BY-NC" | "CC-BY-NC-SA" | "CC-BY-ND" | "CC-BY-NC-ND" | "CC0" | "resolutio License" | "Your own License"
}

export interface IFileUploadedResponse {
    name: string;
    hash: string;
    size: string;
}

export interface ICreateWorkSchema {
    metadata: ICreatorWorkMetadata,
    fileUploadResponse: {
        data: { fileUploadResponse?: IFileUploadedResponse, licenseUploadResponse?: IFileUploadedResponse },
        meshUrl: {
            fileUrl?: string,
            licenseUrl?: string
        }
    },
    finalCID: string
}