// import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
// import { User } from './bean/User';
import { DBUtil } from './DBUtil';
// import { User } from './bean/User';
// import { UserReq } from './bean/User';

// before
// export const getUsers = functions
//     .https.onRequest((request: functions.Request, response: functions.Response) => {
// after
// module.exports = functions.https.onRequest((request: functions.Request, response: functions.Response) => {
export const getUsers = functions
    .https.onRequest(async (request: functions.Request, response: functions.Response) => {
        console.log('----------');
        const users = await DBUtil.getDBItems('/users', 'Id');
        console.log('@@ users.length: [' + users.length + ']');
        // users.forEach((user) => {
        //     console.log('@@ user.Id: [' + user.child('Id').val() + ']');
        //     console.log('@@ user.Name: [' + user.child('Name').val() + ']');
        //     console.log('@@ user.SpeakingName: [' + user.child('SpeakingName').val() + ']');
        // });
        console.log('----------');

        response.setHeader('Access-Control-Allow-Origin', '*');
        console.log('@@ setHeader @@');
        console.log('@@ response.header: [' + JSON.stringify(response.getHeaders()) + ']');

        response.status(200).json(users).end();
    });
// export const getUsers = functions
//     .https.onRequest((request: functions.Request, response: functions.Response) => {
//         console.log('----------');
//         const usersRef = admin.database().ref('/users');
//         console.log('----------');
//         const array: User.User[] = new Array();
//         usersRef.orderByChild('Id').on('value', (snapshot) => {
//             snapshot!.forEach((data) => {
//                 // console.log(data.key + ':' +
//                 //     data.child('Id').val() + ':' +
//                 //     data.child('Name').val() + ':' +
//                 //     data.child('SpeakingName').val());
//                 console.log(data.val());
//                 array.push(data.val());
//                 // クラスへの変換
//                 const user: User.User = JSON.parse(JSON.stringify(data.val())) as User.User;
//                 console.log('@@  Id: ' + user.Id + '  Name: ' + user.Name + '  SpeakingName: ' + user.SpeakingName);
//             });
//             console.log('---< array >---');
//             console.log(JSON.stringify(array));
//             console.log('----------');
//             response.status(200).json(array).end();
//         });
//         // 一覧を単純に JSON 化
//         usersRef.orderByKey().on('value', (snapshot) => {
//             const users = snapshot!.val();
//             const array = Object.keys(users).map((key) => users[key]);
//             console.log('---< array >---');
//             console.log(array);
//             console.log('----------');
//             response.status(200).json(array).end();
//         });
//     });

export const getUser = functions
    .https.onRequest(async (request: functions.Request, response: functions.Response) => {
        console.log('getUser');
        console.log('getUser  request.url: ' + JSON.stringify(request.url));
        console.log('getUser  request.method: ' + JSON.stringify(request.method));
        console.log('getUser  request.body: ' + JSON.stringify(request.body));
        const id = request.body.Id;
        console.log('getUser  data  Id: [' + id + ']');
        console.log('----------');
        const users = await DBUtil.getDBItem('/users', id);
        console.log('@@ users.length: [' + users.length + ']');
        if (users.length < 1) {
            response.status(500).json('NG').end();
        }
        users.forEach((user) => {
            console.log('@@ user.Id: [' + user.child('Id').val() + ']');
            console.log('@@ user.Name: [' + user.child('Name').val() + ']');
            console.log('@@ user.SpeakingName: [' + user.child('SpeakingName').val() + ']');
        });
        console.log('----------');

        response.setHeader('Access-Control-Allow-Origin', '*');
        // response.setHeader('Access-Control-Request-Headers', 'application/json, content-type');
        console.log('@@ setHeader @@');
        console.log('@@ response.header: [' + JSON.stringify(response.getHeaders()) + ']');

        response.status(200).json(users[0]).end();
    });

export const setUser = functions
    .https.onRequest(async (request: functions.Request, response: functions.Response) => {
        console.log('setUser');
        console.log('setUser  request.url: ' + JSON.stringify(request.url));
        console.log('setUser  request.method: ' + JSON.stringify(request.method));
        console.log('setUser  request.body: ' + JSON.stringify(request.body));
        const data = JSON.parse(request.body.userInfo);
        console.log('setUser  data  Id: [' + data.Id + ']  Name: [' + data.Name + ']  SpeakingName: [' + data.SpeakingName + ']');

        console.log('----------');
        if (data.Id < 0) {
            const users = await DBUtil.getDBItems('/users', 'Id');
            console.log('@@ users.length: [' + users.length + ']');
            users.forEach((user) => {
                console.log('@@ user.Id: [' + user.child('Id').val() + ']');
                if (data.Id > user.Id) {
                    data.Id = user.Id;
                }
            });
        }
        console.log('@@ Id: [' + data.Id + ']');
        console.log('----------');
    
        console.log('----------');
        await DBUtil.setDBItem('/users', data.Id, data);
        // if (user.length < 1) {
        //     response.status(500).json('NG').end();
        // }
        console.log('----------');

        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Request-Headers', 'application/json, content-type');
        console.log('@@ setHeader @@');
        console.log('@@ response.header: [' + JSON.stringify(response.getHeaders()) + ']');

        response.status(200).json('OK').end();
    });

console.log('user loaded');
