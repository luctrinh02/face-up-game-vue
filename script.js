new Vue({
  el: "#main",
  data() {
    return {
      minutes: 10,
      seconds: 00,
      maxPoint: window.localStorage.getItem("maxPoint"),
      nowPoint: 0,
      levels: 6,
      maxLevel: 6,
      buttonMap: [],
      faceUps: [],
      countingSucc: 0,
      disableAll: false,
      done: false,
      isStartGame: false,
      showAgain: false,
    };
  },
  methods: {
    countDown: function () {
      if (!this.done) {
        if (this.minutes <= 0 && this.seconds <= 0) {
          this.endGame();
        } else {
          setTimeout(() => {
            this.seconds--;
            if (this.seconds < 0) {
              this.seconds = 59;
              this.minutes--;
            }
            this.countDown();
          }, 1000);
        }
      } else {
        this.succGame();
      }
    },
    endGame: function () {
      Swal.fire({
        title: "Đồ ngu đồ ăn hại!",
        text: "Làm lại cuộc đời đê",
        imageUrl: "https://unsplash.it/400/200",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image",
      });
      this.showAgain = true;
      this.disableAll=true;
    },
    succGame: function () {
      this.nowPoint = this.calPoint();
      Swal.fire({
        title: "Chúc mừng đã hoàn thành màn chơiiii!",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(trees.png)",
        backdrop: `
              rgba(0,0,123,0.4)
              url("nyan-cat.gif")
              left top
              no-repeat
            `,
      });
      this.showAgain = true;
      this.disableAll=true;
    },
    newGame: function () {
      axios.get("data.json").then((response) => {
        this.buttonMap = this.shuffleButton(response.data);
      });
      this.nowPoint = 0;
      this.minutes = 10;
      this.seconds = 00;
      this.countingSucc = 0;
      this.isStartGame = false;
      this.disableAll = false;
      this.faceUps = [];
      this.done = false;
      this.showAgain = false;
    },
    shuffleButton: function (array) {
      let currentIndex = array.length,
        randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
      return array;
    },
    changeFace: function (obj, value) {
      obj.isFaceUp = value;
      obj.isDisable = value;
      return obj;
    },
    buttonClick: function (index) {
      this.isStartGame = true;
      if (this.buttonMap[index].isFaceUp == true) {
        return;
      }
      let num = this.faceUps.length;
      this.buttonMap[index].isFaceUp = true;
      switch (num) {
        case 0:
          this.faceUps.push(index);
          break;
        case 1:
          if (
            this.buttonMap[this.faceUps[0]].value == this.buttonMap[index].value
          ) {
            this.buttonMap[this.faceUps[0]] = this.changeFace(
              this.buttonMap[this.faceUps[0]],
              true
            );
            this.buttonMap[index] = this.changeFace(
              this.buttonMap[index],
              true
            );
            this.faceUps = [];
            this.countingSucc += 1;
            if (this.countingSucc == 72) {
              this.done=true;
            }
          } else {
            this.faceUps.push(index);
          }
          break;
        case 2:
          this.buttonMap[this.faceUps[0]] = this.changeFace(
            this.buttonMap[this.faceUps[0]],
            false
          );
          this.buttonMap[this.faceUps[1]] = this.changeFace(
            this.buttonMap[this.faceUps[1]],
            false
          );
          this.faceUps = [];
          this.faceUps.push(index);
          break;
      }
    },
    calPoint: function () {
      let point = 0;
      point =
        point + (this.minutes * 60 +    this.seconds + this.minutes + 7) * this.minutes;
      return point;
    },
  },
  computed: {
    getSeconds: function () {
      if (this.seconds < 10) {
        return "0" + String(this.seconds);
      } else {
        return this.seconds;
      }
    },
    getMinutes: function () {
      if (this.minutes < 10) {
        return "0" + String(this.minutes);
      } else {
        return this.minutes;
      }
    },
    getColClass: function () {
      return "col-" + 6 / this.levels;
    },
  },
  watch: {
    nowPoint: function () {
      if (this.maxPoint < this.nowPoint) {
        this.maxPoint = this.nowPoint;
        window.localStorage.setItem("maxPoint", this.maxPoint);
      }
    },
    isStartGame: function () {
      if (this.isStartGame == true) {
        this.countDown();
      }
    },
  },
  mounted() {
    if (this.maxPoint == null || this.maxPoint == "undefined") {
      this.maxPoint = 0;
      window.localStorage.setItem("maxPoint", this.maxPoint);
    }
    axios.get("data.json").then((response) => {
      this.buttonMap = this.shuffleButton(response.data);
    });
  },
});
