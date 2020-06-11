<template>
  <div class="timer">
    {{this.now}}
  </div>
</template>

<script>
import liveTime from "@/_helper/dateCountDown";
export default {
    name: "Timer",
    props: {
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        }
    },
    data () {
        return {
            now: "expired",
            liveCounDownInterval: null
        };
    },
    created () {
        this.liveAuctionCountDown();
    },
    methods: {
        liveAuctionCountDown () {
            const nowTime = new Date();
            let distance, tempLiveCountdown;
            if (nowTime < this.startDate) {
                // if auction has not strated, start ountdown 'until strat'
                this.now = `starts in ${liveTime(this.startDate)}`;
                distance = this.startDate - nowTime;
                if (distance > 0) {
                    // if time left is less that a minut make interval 1 sec if not then 1 min
                    const myInternval = distance <= 3600000 ? 1000 : 60000;
                    this.liveCounDownInterval = setInterval(() => {
                        tempLiveCountdown = liveTime(this.startDate);
                        if (tempLiveCountdown === "expired") {
                            this.$emit("timerStatus", true);
                            tempLiveCountdown = liveTime(this.endDate);
                            this.$emit("timerStatus", tempLiveCountdown !== "expired");
                            this.now = tempLiveCountdown;
                        } else {
                            this.now = `starts in ${liveTime(this.startDate)}`;
                        }
                    }, myInternval);
                }
            } else if (nowTime < this.endDate) {
                this.now = liveTime(this.endDate);
                distance = this.endDate - nowTime;
                if (distance > 0) {
                    const myInternval = distance <= 3600000 ? 1000 : 60000;
                    this.liveCounDownInterval = setInterval(() => {
                        tempLiveCountdown = liveTime(this.endDate);
                        this.$emit("timerStatus", tempLiveCountdown !== "expired");
                        this.now = tempLiveCountdown;
                    }, myInternval);
                }
            }
        }
    }
};
</script>

<style>

</style>
