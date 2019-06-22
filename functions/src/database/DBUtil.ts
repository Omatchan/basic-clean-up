import * as admin from 'firebase-admin';

// tslint:disable-next-line:interface-over-type-literal
type Update = { [key: string]: string | number | JSON};

export class DBUtil {

    public static async getDBItems(url: string, order: string): Promise<any[]> {
        return await this.asyncGetDBItems(url, order);
    }

    private static asyncGetDBItems(url: string, order: string): Promise<any[]> {
        return new Promise((resolve) => {
            const result: any[] = new Array();

            const ref = admin.database().ref(url);
            ref.orderByChild(order).on('value', (snapshot) => {
                snapshot!.forEach((datas) => {
                    // console.log('@@ num: ' + datas.numChildren());
                    // console.log('@@ key: ' + datas.key);
                    // datas.forEach((data) => {
                    //     console.log('@@   ' + data.key + ' : ' + data.val());
                    // });
                    result.push(datas);
                    // const item: any = new Array();
                    // console.log('@@  num: ' + datas.numChildren());
                    // console.log('@@  key: ' + datas.key);
                    // item['key'] = datas.key;
                    // item.set('key', datas.key);
                    // datas.forEach((data) => {
                    //     console.log(data.key + ':' + data.val());
                    //     item[data.key!] = datas.val();
                    //     item.set(<string>data.key, data.val());
                    // });
                    // result.push(item);
                });
                resolve(result);
            });
        });
    }

    public static async getDBItem(url: string, id: string): Promise<any[]> {
        return await this.asyncGetDBItem(url, id);
    }

    private static asyncGetDBItem(url: string, id: string): Promise<any[]> {
        return new Promise((resolve) => {
            const result: any[] = new Array();

            const ref = admin.database().ref(url);
            ref.orderByChild('Id').startAt(id).endAt(id)
            .on('value', (snapshot) => {
                snapshot!.forEach((datas) => {
                    console.log('@@ num: ' + datas.numChildren());
                    console.log('@@ key: ' + datas.key);
                    datas.forEach((data) => {
                        console.log('@@   ' + data.key + ' : ' + data.val());
                    });
                    result.push(datas);
                    // const item: any = new Array();
                    // console.log('@@  num: ' + datas.numChildren());
                    // console.log('@@  key: ' + datas.key);
                    // item['key'] = datas.key;
                    // item.set('key', datas.key);
                    // datas.forEach((data) => {
                    //     console.log(data.key + ':' + data.val());
                    //     item[data.key!] = datas.val();
                    //     item.set(<string>data.key, data.val());
                    // });
                    // result.push(item);
                });
                resolve(result);
            });
        });
    }

    public static async setDBItem(url: string, id:string, data: JSON) {
        const updates: Update = {};
        updates[url + '/' + id] = data;
        await admin.database().ref().update(updates);
    }

}

console.log('DBUtil.ts loaded');
