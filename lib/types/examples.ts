import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Files } from "./files.ts";
import { User } from "./user.ts";
import { Chat, ChatRoles, ChatType, Messages, Roles, Theme } from "./index.ts";
import { Privacy } from "./types.ts";

export const userArray: User[] = [
    {
        id: 'user-001',
        email: 'alice@example.com',
        username: 'alice01',
        firstName: 'Alice',
        lastName: 'Smith',
        profilePicture: {url: "https://upload.wikimedia.org/wikipedia/commons/7/74/%E0%B4%95%E0%B5%88%E0%B4%A4%E0%B4%9A%E0%B5%8D%E0%B4%9A%E0%B4%95%E0%B5%8D%E0%B4%95.jpg"},
        meta: {
            settings: {
                theme: Theme.dark,
                privacy: Privacy.public
            },
            preferences: {
                chosenPreferences: ['technology', 'science'],
                calculatedPreferences: [{ 'AI': 0.9 }, { 'Robotics': 0.8 }]
            },
            history: {
                search: ['AI trends', 'latest in robotics'],
                project: ['project-101', 'project-202'],
                people: ['user-102', 'user-203'],
                organisations: ['org-001', 'org-002'],
                posts: ['post-001', 'post-002']
            }
        },
        createdAt: DateTime.now()
    },
    {
        id: 'user-002',
        email: 'bob@example.com',
        username: 'bob02',
        firstName: 'Bob',
        lastName: 'Johnson',
        profilePicture: {url: "https://images.unsplash.com/photo-1494391752466-8a915c192649?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        meta: {
            settings: {
                theme: Theme.light,
                privacy: Privacy.public
            },
            preferences: {
                chosenPreferences: ['sports', 'health'],
                calculatedPreferences: [{ 'Fitness': 0.7 }, { 'Nutrition': 0.85 }]
            },
            history: {
                search: ['workout tips', 'healthy recipes'],
                project: ['project-303'],
                people: ['user-104'],
                organisations: ['org-003'],
                posts: ['post-003']
            }
        },
        createdAt: DateTime.now()
    },
    {
        id: 'user-003',
        email: 'carol@example.com',
        username: 'carol03',
        firstName: 'Carol',
        lastName: 'Williams',
        profilePicture: {url: "https://images.unsplash.com/photo-1735905131227-88f4942d1d38?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        meta: {
            settings: {
                theme: Theme.system,
                privacy: Privacy.private
            },
            preferences: {
                chosenPreferences: ['music', 'movies'],
                calculatedPreferences: [{ 'Pop': 0.8 }, { 'Action': 0.9 }]
            },
            history: {
                search: ['latest movies', 'music charts'],
                project: ['project-404'],
                people: ['user-105'],
                organisations: ['org-004'],
                posts: ['post-004']
            }
        },
        createdAt: DateTime.now()
    }
];

export const filesArray: Files[] = [
    {
        id: 'file-001',
        userId: userArray[0],
        filePath: '/uploads/documents/report1.pdf',
        name: 'report1',
        extension: 'pdf',
        createdAt: DateTime.now()
    },
    {
        id: 'file-002',
        userId: userArray[1],
        filePath: '/uploads/images/pic1.jpg',
        name: 'pic1',
        extension: 'jpg',
        createdAt: DateTime.now()
    },
    {
        id: 'file-003',
        userId: userArray[2],
        filePath: '/uploads/videos/video1.mp4',
        name: 'video1',
        extension: 'mp4',
        createdAt: DateTime.now()
    },
    {
        id: 'file-004',
        userId: userArray[0],
        filePath: '/uploads/documents/report2.docx',
        name: 'report2',
        extension: 'docx',
        createdAt: DateTime.now()
    },
    {
        id: 'file-005',
        userId: userArray[1],
        filePath: '/uploads/images/pic2.png',
        name: 'pic2',
        extension: 'png',
        createdAt: DateTime.now()
    },
    {
        id: 'file-006',
        userId: userArray[2],
        filePath: '/uploads/videos/video2.avi',
        name: 'video2',
        extension: 'avi',
        createdAt: DateTime.now()
    },
    {
        id: 'file-007',
        userId: userArray[0],
        filePath: '/uploads/audio/song1.mp3',
        name: 'song1',
        extension: 'mp3',
        createdAt: DateTime.now()
    },
    {
        id: 'file-008',
        userId: userArray[1],
        filePath: '/uploads/pdfs/manual1.pdf',
        name: 'manual1',
        extension: 'pdf',
        createdAt: DateTime.now()
    },
    {
        id: 'file-009',
        userId: userArray[2],
        filePath: '/uploads/spreadsheets/data1.xlsx',
        name: 'data1',
        extension: 'xlsx',
        createdAt: DateTime.now()
    },
    {
        id: 'file-010',
        userId: userArray[0],
        filePath: '/uploads/presentations/deck1.pptx',
        name: 'deck1',
        extension: 'pptx',
        createdAt: DateTime.now()
    }
];

// userArray.map(user => user.profilePicture == null ? (user.profilePicture = {url: "",  file: filesArray.find(file => file.userId.id == user.id)} ) : null)


export const chatArray: Chat[] = [
    {
        id: 'chat-001',
        chatType: ChatType.private_chat,
        createdAt: DateTime.now(),
        photo: null
    },
    {
        id: 'chat-002',
        chatType: ChatType.private_chat,
        createdAt: DateTime.now(),
        photo: {url: "https://images.unsplash.com/photo-1733287120177-db0769c40309?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
    },
    {
        id: 'chat-003',
        chatType: ChatType.private_chat,
        name: 'Oh Fck',
        createdAt: DateTime.now(),
        photo: null
    },
    {
        id: 'chat-004',
        chatType: ChatType.private_group,
        name: 'My Bitches',
        createdAt: DateTime.now(),
        photo: {url: "https://plus.unsplash.com/premium_photo-1734737431219-198135c23458?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
    }
];

export const chatRolesArray: ChatRoles[] = [
    { id: 'role-001', user: userArray[0], chat: chatArray[0], role: Roles.memeber, joinedAt: DateTime.now() },
    { id: 'role-002', user: userArray[1], chat: chatArray[0], role: Roles.memeber, joinedAt: DateTime.now() },
    { id: 'role-003', user: userArray[1], chat: chatArray[1], role: Roles.memeber, joinedAt: DateTime.now() },
    { id: 'role-004', user: userArray[2], chat: chatArray[1], role: Roles.memeber, joinedAt: DateTime.now() },
    { id: 'role-005', user: userArray[0], chat: chatArray[2], role: Roles.memeber, joinedAt: DateTime.now() },
    { id: 'role-006', user: userArray[2], chat: chatArray[2], role: Roles.memeber, joinedAt: DateTime.now() },
    { id: 'role-007', user: userArray[0], chat: chatArray[3], role: Roles.owner, joinedAt: DateTime.now() },
    { id: 'role-008', user: userArray[1], chat: chatArray[3], role: Roles.memeber, joinedAt: DateTime.now() },
    { id: 'role-009', user: userArray[2], chat: chatArray[3], role: Roles.memeber, joinedAt: DateTime.now() }
];

export const messagesArray: Messages[] = [
    // Chat 1 Messages
    {
        id: 'msg-001',
        user: chatRolesArray[0],
        chat: chatArray[0],
        content: 'Hi Bob!',
        sentAt: DateTime.now()
    },
    {
        id: 'msg-002',
        user: chatRolesArray[1],
        chat: chatArray[0],
        content: 'Hey Alice!',
        sentAt: DateTime.now()
    },
    {
        id: 'msg-003',
        user: chatRolesArray[0],
        chat: chatArray[0],
        content: 'How have you been?',
        sentAt: DateTime.now()
    },
    {
        id: 'msg-004',
        user: chatRolesArray[1],
        chat: chatArray[0],
        content: 'I am doing well, thanks!',
        sentAt: DateTime.now()
    },

    // Chat 2 Messages
    {
        id: 'msg-005',
        user: chatRolesArray[2],
        chat: chatArray[1],
        content: 'Hi Carol!',
        sentAt: DateTime.now()
    },
    {
        id: 'msg-006',
        user: chatRolesArray[3],
        chat: chatArray[1],
        content: 'Hey Bob!',
        sentAt: DateTime.now()
    },
    {
        id: 'msg-007',
        user: chatRolesArray[2],
        chat: chatArray[1],
        content: 'What are you up to?',
        sentAt: DateTime.now()
    },
    {
        id: 'msg-008',
        user: chatRolesArray[3],
        chat: chatArray[1],
        content: 'Just working on a project.',
        sentAt: DateTime.now()
    },

    // Chat 3 Messages
    {
        id: 'msg-009',
        user: chatRolesArray[4],
        chat: chatArray[2],
        content: 'Hi Carol!',
        sentAt: DateTime.now()
    },
    {
        id: 'msg-010',
        user: chatRolesArray[5],
        chat: chatArray[2],
        content: 'Hey Alice!',
        sentAt: DateTime.now()
    },
    {
        id: 'msg-011',
        user: chatRolesArray[4],
        chat: chatArray[2],
        content: 'Do you have the latest report?',
        sentAt: DateTime.now()
    },
    {
        id: 'msg-012',
        user: chatRolesArray[5],
        chat: chatArray[2],
        content: 'Yes, I will share it soon.',
        sentAt: DateTime.now()
    },

    // Group Chat Messages
    {
        id: 'msg-013',
        user: chatRolesArray[6],
        chat: chatArray[3],
        content: 'Hello everyone!',
        sentAt: DateTime.now()
    },
    {
        id: 'msg-014',
        user: chatRolesArray[7],
        chat: chatArray[3],
        content: 'Hi Alice!',
        sentAt: DateTime.now()
    },
    {
        id: 'msg-015',
        user: chatRolesArray[8],
        chat: chatArray[3],
        content: 'Hey guys!',
        sentAt: DateTime.now()
    },
    {
        id: 'msg-016',
        user: chatRolesArray[6],
        chat: chatArray[3],
        content: 'What’s the plan for today’s meeting?',
        sentAt: DateTime.now()
    }
];

chatArray.map(chat => {
    chat.users = chatRolesArray.filter(role => role.chat.id == chat.id)
});

chatArray.map(chat => {
    chat.lastMessage = messagesArray.findLast(msg => msg.chat.id == chat.id)
})