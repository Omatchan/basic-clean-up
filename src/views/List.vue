<template>
  <div class="list">
    <div>
      <v-toolbar flat color="gray">
        <v-toolbar-title>ユーザー管理</v-toolbar-title>
        <v-divider class="mx-3" inset vertical></v-divider>

        <!-- リスト更新ボタン -->
        <v-icon @click="refresh()">refresh</v-icon>

        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <!-- ユーザ追加ボタン フォームは下部 -->
        <v-btn fab dark small color="dark" class="mb-2" @click="dialog = true">
          <v-icon dark>add</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- データテーブル部分
        rows-per-page-text='' 1ページあたり件数テキストの非表示
        :rows-per-page-items='[]' 1ページあたり件数セレクトの非表示
       -->
      <v-data-table
        :headers="headers"
        :items="userList"
        :search="search"
        rows-per-page-text=""
        :rows-per-page-items="[]"
        class="elevation-1"
        v-show="!deleteDialog"
      >
        <!-- テーブルボディ -->
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.Id }}</td>
          <td class="text-xs-center">{{ props.item.Name }}</td>
          <td class="text-xs-center">{{ props.item.SpeakingName }}</td>
          <td class="justify-center layout px-0">
            <!-- 編集ボタン -->
            <v-icon class="mr-2" @click="editUser(props.item.Id)">
              edit
            </v-icon>
            <!-- 削除ボタン -->
            <v-icon @click="openDeleteDialog(props.item.Id)">
              delete
            </v-icon>
          </td>
        </template>

        <!-- 検索結果なし -->
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          '{{ search }}' の検索結果なし
        </v-alert>
        <!-- データなしの時の表示 -->
        <template slot="no-data">
          No Data
        </template>

        <!-- フッターの件数表示 -->
        <template slot="pageText" slot-scope="props">
          {{ props.itemsLength }} 件中 {{ props.pageStart }} 件目 〜
          {{ props.pageStop }} 件目
        </template>
      </v-data-table>

      <!-- 入力ダイアログのレイアウト -->
      <v-layout row justify-center>
        <v-dialog v-model="dialog" lazy persistent max-width="600px">
          <v-form v-model="valid" lazy-validation>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                      <v-text-field
                        v-model="selectedUser.Id"
                        label="Id"
                        :rules="idRules"
                        :counter="6"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field
                        v-model="selectedUser.Name"
                        label="名前 (*)"
                        :rules="nameRules"
                        :counter="16"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        v-model="selectedUser.SpeakingName"
                        label="読み (*)"
                        :rules="speakingNameRules"
                        :counter="16"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  flat
                  @click="save"
                  :disabled="!valid"
                  >保存</v-btn
                >
                <v-btn color="blue darken-1" flat @click="close"
                  >キャンセル</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-layout>

      <!-- 削除確認ダイアログのレイアウト -->
      <v-layout row justify-center>
        <v-dialog v-model="deleteDialog" persistent max-width="290px">
          <v-card-text>
            削除しますか？
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="deleteUser">削除</v-btn>
            <v-btn color="blue darken-1" flat @click="close">キャンセル</v-btn>
          </v-card-actions>
        </v-dialog>
      </v-layout>
    </div>
  </div>
</template>

<script lang="ts">
// import 'functions';
// import 'firebase/functions/';
import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';

@Component({})
export default class List extends Vue {
  // ユーザ一覧が入る配列
  private userList = [];

  // テーブルヘッダ
  private headers = [
    { text: 'ID', align: 'center', value: 'Id' },
    { text: '名前', align: 'center', value: 'Name' },
    { text: '読み', align: 'center', value: 'SpeakingName' },
    { text: '操作', align: 'center', value: 'action', sortable: false },
  ];

  // 選択中のレコードの値
  private selectedUser = {
    Id: -1,
    Name: '',
    SpeakingName: '',
  };

  // レコードの初期値
  private defaultValue = {
    Id: -1,
    Name: '',
    SpeakingName: '',
  };

  private search = ''; // フィルタリング検索キーワード
  private dialog = false; // 新規＆更新 入力フォーム
  private deleteDialog = false; // 削除確認ダイアログ
  private valid = false; // バリデーション結果

  private idRules = [
    (v: string) => v.length <= 6 || 'Idは6文字までです',
    (v: string) => !!isFinite(Number(v)) || 'Idは数値です',
  ];

  private nameRules = [
    (v: string) => !!v || '名前は必須です',
    (v: string) => v.length <= 16 || '名前は16文字までです',
  ];

  private speakingNameRules = [
    (v: string) => !!v || '読みは必須です',
    (v: string) => v.length <= 16 || '読みは16文字までです',
  ];

  // ユーザ一覧
  public indexUsers() {
    console.log('ユーザ一覧');
    this.userList = [];
    const url = 'http://localhost:5000/basiccleanup/us-central1/getUsers';
    axios(url)
      .then((response) => {
        console.log(
          'ユーザ一覧 response.data: ' + JSON.stringify(response.data),
        );
        this.userList = response.data;
        console.log('Index : record num=' + this.userList.length);
      })
      .catch((error) => {
        console.log('Error : ' + error);
      });
  }

  // ユーザ作成
  public createUser(userInfo: any) {
    console.log('ユーザ作成');
    console.log('ユーザ作成 userInfo: ' + JSON.stringify(userInfo));
    const url = 'http://localhost:5000/basiccleanup/us-central1/setUser';
    const params = new URLSearchParams();
    params.append('userInfo', JSON.stringify(userInfo));
    console.log('ユーザ作成 params: ' + JSON.stringify(params));
    axios
      .post(url, params)
      .then((response) => {
        console.log('Created : Id=' + response.data.Id);
      })
      .catch((error) => {
        console.log('Error : ' + error);
      })
      .then(() => {
        this.indexUsers();
      });
  }

  // ユーザ編集(読み出し)
  public editUser(Id: number) {
    console.log('ユーザ編集(読み出し)');
    console.log('ユーザ編集(読み出し) Id: ' + Id);
    this.selectedUser.Id = Id;
    const url = 'http://localhost:5000/basiccleanup/us-central1/getUser/';
    const params = new URLSearchParams();
    params.append('Id', String(Id));
    console.log('ユーザ編集(読み出し) params: ' + params);
    axios
      .post(url, params)
      .then((response) => {
        console.log(
          'ユーザ編集(読み出し) response.data: ' +
            JSON.stringify(response.data),
        );
        this.selectedUser = response.data;
        console.log('Edit : Id=' + this.selectedUser.Id);
        this.dialog = true;
      })
      .catch((error) => {
        console.log('Error : ' + error);
      });
  }

  // ユーザ編集(書き込み)
  public updateUser(userInfo: any) {
    console.log('ユーザ編集(書き込み)');
    console.log('ユーザ編集(書き込み) userInfo: ' + JSON.stringify(userInfo));
    const url = 'http://localhost:5000/basiccleanup/us-central1/setUser/';
    const params = new URLSearchParams();
    params.append('userInfo', JSON.stringify(userInfo));
    console.log('ユーザ編集(書き込み) params: ' + JSON.stringify(params));
    axios
      .post(url, params)
      // axios.patch(url, userInfo)
      // axios.patch('http://localhost:3000/users/' + userInfo.Id, userInfo)
      .then((response) => {
        console.log('Updated : Id=' + response.data.Id);
      })
      .catch((error) => {
        console.log('Error : ' + error);
      })
      .then(() => {
        this.indexUsers();
      });
  }

  // 削除ダイアログ
  public openDeleteDialog(Id: number) {
    console.log('削除ダイアログ');
    console.log('削除ダイアログ Id: ' + Id);
    this.selectedUser.Id = Id;
    this.deleteDialog = true;
  }

  // ユーザ削除
  public deleteUser() {
    console.log('ユーザ削除');
    axios
      .delete('http://localhost:3000/users/' + this.selectedUser.Id)
      .then((response) => {
        console.log('Deleted : Id=' + this.selectedUser.Id);
      })
      .catch((error) => {
        console.log('Error : ' + error);
      })
      .then(() => {
        this.indexUsers();
        this.close();
      });
  }

  // 一覧の最新化
  public refresh() {
    console.log('一覧の最新化');
    console.log('Refresh');
    this.indexUsers();
  }

  // ダイアログの保存ボタン
  public save() {
    console.log('ダイアログの保存ボタン');
    console.log(
      'ダイアログの保存ボタン this.selectedUser.Id: ' + this.selectedUser.Id,
    );
    if (this.selectedUser.Id === -1) {
      // 作成
      console.log('ダイアログの保存ボタン: 作成');
      this.createUser(this.selectedUser);
    } else {
      // 更新
      console.log('ダイアログの保存ボタン: 更新');
      this.updateUser(this.selectedUser);
    }
    this.close();
  }

  // ダイアログのキャンセルボタン
  public close() {
    console.log('ダイアログのキャンセルボタン');
    this.dialog = false;
    this.deleteDialog = false;
    setTimeout(() => {
      this.selectedUser = Object.assign({}, this.defaultValue);
    }, 500);
  }

  // ダイアログのタイトルを作成と更新で使い分ける
  get formTitle(): string {
    console.log('ダイアログのタイトルを作成');
    console.log(
      'ダイアログのタイトルを作成 this.selectedUser.Id: ' +
        this.selectedUser.Id,
    );
    console.log(
      'ダイアログのタイトルを作成 this.selectedUser.Id === -1: ' +
        (this.selectedUser.Id === -1),
    );
    return this.selectedUser.Id === -1 ? '新規ユーザ情報' : 'ユーザ情報の編集';
  }

  public mounted(): void {
    console.log('mounted  this.indexUsers()');
    this.indexUsers();
  }
}
</script>

<style scoped></style>
