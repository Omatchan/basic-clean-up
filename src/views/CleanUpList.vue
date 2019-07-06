<template>
  <div class="cleanuplist">
    <div>
      <v-toolbar flat color="gray">
        <v-toolbar-title>掃除担当表</v-toolbar-title>
        <v-divider class="mx-3" inset vertical></v-divider>
      </v-toolbar>
      <v-container grid-list-md text-xs-center>
        <v-layout align-space-around justify-space-around row fill-height>
          <v-flex v-for="cleanUp in cleanUpList" :key="cleanUp.place.Id">
            <!-- 青：#2B8DF2  緑：#65D573  黄：#FFD573  赤：#F35D44 -->
            <!-- 青：#61A9F5  緑：#8CE096  黄：#FFDF96  赤：#F58673 -->
            <!-- 青：#95C6F9  緑：#B2EAB9  黄：#FFEAB9  赤：#F9AFA2 -->
            <v-card color="#2B8DF2">
              <v-card-text class="px-0">{{ cleanUp.place.Name }}</v-card-text>
            </v-card>
            <v-layout column wrap>
              <v-flex v-for="user in cleanUp.users" :key="user.Id">
                <div padding="12px">
                  <v-card color="#95C6F9" padding="12px">
                    <v-card-text class="px-0">{{ user.Id }}:{{ user.Name }}</v-card-text>
                  </v-card>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';

@Component({})
export default class CleanUpList extends Vue {
  // 掃除担当表が入る配列
  private cleanUpList = [];

  // 掃除担当表
  public indexCleanUp() {
    console.log('掃除担当表');
    this.cleanUpList = [];
    const url = '/getTeams';
    axios(url)
      .then((response) => {
        console.log('掃除担当表 response.data: ' + JSON.stringify(response.data));
        this.cleanUpList = response.data;
        console.log('Index : record num=' + this.cleanUpList.length);
      })
      .catch((error) => {
        console.log('Error : ' + error);
      });
  }

  public mounted(): void {
    console.log('mounted  this.indexCleanUp()');
    this.indexCleanUp();
  }
}
</script>
