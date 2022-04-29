// Interfaces
import { MutationTree, ActionTree } from 'vuex';
import SendBird from 'sendbird';
import SendbirdChat from '@sendbird/chat';
import { OpenChannelModule } from '@sendbird/chat/openChannel';
// import { GroupChannelModule } from '@sendbird/chat/groupChannel';

// export const sb = new SendBird({ appId, localCacheEnabled: true });
// export const sb = SendbirdChat.init({
//   appId,
//   modules: [
//     new OpenChannelModule(),
//     // new GroupChannelModule()
//   ],
// });

// console.log({ sb, appId, env: '' });



// export const state = () => ({
//   messages: [] as any
// });

// export type RootStateSendBird = ReturnType<typeof state>;

// export const mutations: MutationTree<RootStateSendBird> = {
//   SET_MESSAGES: (state, value: any) => (state.messages = value),
// };

// export const actions: ActionTree<RootStateSendBird, RootStateSendBird> = {
//   /**
//    * @function connect
//    * @param {number} userId
//    * @description Login/Register a user to SendBird application
//    */
//   connect(_store, userId: any) {
//     return new Promise((resolve, reject) => {
//       sb.connect(userId, function (user: any, error: any) {
//         if (error) reject(new Error(`Login Failed: ${ error }`));
//         resolve(user);
//       });
//     });
//   },

//   /**
//    * @function addUserMetadata
//    * @param {Object} payload
//    * @description add custom data to user object
//    */
//   addUserMetadata(_store, payload: any) {
//     return new Promise((resolve, reject) => {
//       const user = sb.currentUser;
//       user.createMetaData(payload, function (metadata: any, error: any) {
//         if (error) reject(new Error(`Couldn't add data: ${ error }`));
//         resolve(metadata);
//       });
//     });
//   },

//   /**
//    * @function startChat
//    * @param {Array} userIds
//    * @description SendBird enables the creation of private channels; To start a one-on-one chat needs creation of a channel with two members
//    */
//   startChat(_store, userIds) {
//     return new Promise((resolve, reject) => {
//       // The boolean argument below directs the app to look for an existing chat between
//       // the two users. Creates a new chat if no match is found
//       sb.GroupChannel.createChannelWithUserIds(
//         userIds, true, function (channel: any, error: any) {
//           if (error) reject(new Error(`Channel creation Failed: ${ error }`));
//           resolve(channel);
//         });
//     });
//   },

//   createChannel(_store) {
//     return new Promise((resolve, reject) => {
//       // The boolean argument below directs the app to look for an existing chat between
//       // the two users. Creates a new chat if no match is found
//       sb.OpenChannel.createChannel(
//         function (openChannel: any, error: any) {
//           console.log({ openChannel });
//           if (error) reject(new Error(`Channel creation Failed: ${ error }`));
//           resolve(openChannel);
//         });
//     });
//   },

//   getChannel(_store, channelUrl) {
//     return new Promise((resolve, reject) => {
//       // The boolean argument below directs the app to look for an existing chat between
//       // the two users. Creates a new chat if no match is found
//       sb.OpenChannel.getChannel(
//         channelUrl, function (openChannel: any, error: any) {
//           if (error) reject(new Error(`Get Channel Failed: ${ error }`));
//           console.log('getChannel', openChannel);
//           resolve(openChannel);
//           openChannel.enter(function (response: any, error: any) {
//             console.log({ enterResponse: response });
//             if (error) {
//               reject(new Error(`Channel creation Failed: ${ error }`));
//             }

//             // resolve(response);
//             // The current user successfully enters the open channel,
//             // and can chat with other users in the channel by using APIs.
//           });
//         });
//     });
//   },

//   /**
//    * @function deleteChat
//    * @param {string} channelUrl
//    * @description clear chat history for a specific chat
//    */
//   deleteChat(_store, channel) {
//     return new Promise((resolve, reject) => {
//       channel.resetMyHistory(function (response: any, error: any) {
//         if (error) reject(new Error(`Couldn't delete chat: ${ error }`));
//         console.log(response);
//         resolve(response);
//       });
//     });
//   },

//   /**
//    * @function sendMessage
//    * @param {Object} channel
//    * @param {string} message
//    * @description Send a message to another user
//    */
//   sendMessage(_store, { channel, message }: { channel: any, message: any; }) {
//     return new Promise((resolve, reject) => {
//       channel.sendUserMessage(message, (message: any, error: any) => {
//         if (error) reject(new Error(`Message send Failure: ${ error }`));
//         resolve(message);
//       });
//     });
//   },

//   /**
//    * @function getChatList
//    * @description get a list of chats for current user
//    */
//   getChatList(_store) {
//     return new Promise((resolve, reject) => {
//       const channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
//       console.log({ channelListQuery });
//       channelListQuery.includeEmpty = true;
//       channelListQuery.order = 'latest_last_message';

//       if (channelListQuery.hasNext) {
//         channelListQuery.next(function (channelList: any, error: any) {
//           console.log({ channelList });
//           if (error) reject(new Error(`Could not get list: ${ error }`));
//           resolve(channelList);
//         });
//       }
//     });
//   },

//   /**
//    * @function getChatMessages
//    * @param {Object} channel
//    * @description get message history for selected chat
//    */
//   getChatMessages(_store, query: any) {
//     return new Promise((resolve, reject) => {
//       query.limit = 5;
//       query.reverse = false;
//       query.load(function (messages: any, error: any) {
//         if (error) reject(new Error(`Could not get messages: ${ error }`));
//         console.log(JSON.stringify(messages), error);
//         resolve(messages);
//       });
//     });
//   },
// };
