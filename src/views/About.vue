<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class About extends Vue {
  private qqq = ['aa', 'bb'];
  private zzz = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 10,
    k: 11,
    l: 12,
    m: 13,
    n: 14,
    o: 15,
  };
  private ll = 0;

  /**
   * name
   */
  public name(): boolean {
    let flag: boolean = false;
    if (this.ll == 1)
      (done: boolean) => {
        let flag = true;
      };
    return flag;
  }
}
</script>
