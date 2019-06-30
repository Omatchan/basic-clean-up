import * as functions from 'firebase-functions';
import { DBUtil } from './DBUtil';

// before
// export const getPlaces = functions
//     .https.onRequest((request: functions.Request, response: functions.Response) => {
// after
// module.exports = functions.https.onRequest((request: functions.Request, response: functions.Response) => {
export const getPlaces = functions.https.onRequest(
  async (request: functions.Request, response: functions.Response) => {
    console.log('----------');
    const places = await DBUtil.getDBItems('/places', 'Id');
    console.log('@@ places.length: [' + places.length + ']');
    // places.forEach((place) => {
    //   console.log('@@ place.Id: [' + place.child('Id').val() + ']');
    //   console.log('@@ place.Name: [' + place.child('Name').val() + ']');
    //   console.log('@@ place.SpeakingName: [' + place.child('SpeakingName').val() + ']');
    // });
    console.log('----------');

    response.setHeader('Access-Control-Allow-Origin', '*');
    console.log('@@ setHeader @@');
    console.log(
      '@@ response.header: [' + JSON.stringify(response.getHeaders()) + ']',
    );

    response
      .status(200)
      .json(places)
      .end();
  },
);

export const getPlace = functions.https.onRequest(
  async (request: functions.Request, response: functions.Response) => {
    console.log('getPlace');
    console.log('getPlace  request.url: ' + JSON.stringify(request.url));
    console.log('getPlace  request.method: ' + JSON.stringify(request.method));
    console.log('getPlace  request.body: ' + JSON.stringify(request.body));
    const child = request.body.Child;
    const val = request.body.Val;
    console.log('getPlace  data  child: [' + child + ']');
    console.log('getPlace  data  val: [' + val + ']');
    console.log('----------');
    const places = await DBUtil.getDBItem('/places', child, val);
    console.log('@@ places.length: [' + places.length + ']');
    if (places.length < 1) {
      console.log('@@ places.length < 1: 500');
      response
        .status(500)
        .json('NG')
        .end();
      return;
    }
    console.log('@@ places.length OK: [' + places.length + ']');
    places.forEach((place) => {
      console.log('@@ place.Id: [' + place.child('Id').val() + ']');
      console.log('@@ place.Name: [' + place.child('Name').val() + ']');
      console.log(
        '@@ place.SpeakingName: [' + place.child('SpeakingName').val() + ']',
      );
    });
    console.log('----------');

    response.setHeader('Access-Control-Allow-Origin', '*');
    // response.setHeader('Access-Control-Request-Headers', 'application/json, content-type');
    console.log('@@ setHeader @@');
    console.log(
      '@@ response.header: [' + JSON.stringify(response.getHeaders()) + ']',
    );

    response
      .status(200)
      .json(places[0])
      .end();
  },
);

export const setPlace = functions.https.onRequest(
  async (request: functions.Request, response: functions.Response) => {
    console.log('setPlace');
    console.log('setPlace  request.url: ' + JSON.stringify(request.url));
    console.log('setPlace  request.method: ' + JSON.stringify(request.method));
    console.log('setPlace  request.body: ' + JSON.stringify(request.body));
    const data = JSON.parse(request.body.placeInfo);
    console.log(
      'setPlace  data  Id: [' +
        data.Id +
        ']  Name: [' +
        data.Name +
        ']  SpeakingName: [' +
        data.SpeakingName +
        ']',
    );

    console.log('----------');
    if (Number(data.Id) < 0) {
      console.log('@@ data.Id calculate.');
      const places = await DBUtil.getDBItems('/places', 'Id');
      let maxId = -1;
      places.forEach((place) => {
        if (Number(place.child('Id').val()) >= maxId) {
          maxId = Number(place.child('Id').val()) + 1;
        }
      });
      data.Id = String(maxId);
    }
    console.log('@@ Id: [' + data.Id + ']');
    console.log('----------');

    await DBUtil.setDBItem('/places', data.Id, data);
    console.log('----------');

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader(
      'Access-Control-Request-Headers',
      'application/json, content-type',
    );
    console.log('@@ setHeader @@');
    console.log(
      '@@ response.header: [' + JSON.stringify(response.getHeaders()) + ']',
    );

    response
      .status(200)
      .json(data.Id)
      .end();
  },
);

export const removePlace = functions.https.onRequest(
  async (request: functions.Request, response: functions.Response) => {
    console.log('removePlace');
    console.log('removePlace  request.url: ' + JSON.stringify(request.url));
    console.log(
      'removePlace  request.method: ' + JSON.stringify(request.method),
    );
    console.log('removePlace  request.body: ' + JSON.stringify(request.body));
    const child = request.body.Child;
    const val = request.body.Val;
    console.log('removePlace  data  child: [' + child + ']');
    console.log('removePlace  data  val: [' + val + ']');
    console.log('----------');
    const place = await DBUtil.removeDBItem('/places', child, val);
    console.log('@@ place: [' + place + ']');

    response.setHeader('Access-Control-Allow-Origin', '*');
    // response.setHeader('Access-Control-Request-Headers', 'application/json, content-type');
    console.log('@@ setHeader @@');
    console.log(
      '@@ response.header: [' + JSON.stringify(response.getHeaders()) + ']',
    );

    response
      .status(200)
      .json(place)
      .end();
  },
);

console.log('place loaded');
