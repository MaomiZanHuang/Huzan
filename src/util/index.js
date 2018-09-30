/**
 * 替换随机内容
 * @param {*} tpl 
 */
const MD5 = require('js-md5');
// 随机内容
var RANDOM_CONTENTS = [
  '虽然不是很秒，但是很赞！',
  '刷最NB的赞，就上拇指赞https://520cy.cn',
  'QQ互刷哪家强，拇指代刷(https://520cy.cn)我看强！',
  '★─中秋踩一踩~生活变得更精彩─★',
  '有一种跌倒叫爬起,就算华丽地跌倒也能成~',
  '友谊地久天长,友情永不改变',
  '有你~生活充满了阳光,接受一缕阳光你就能容纳',
  '有一种友情叫做永恒,超过了爱情',
  '我管着你，你惯着我，这就是我想要的生活',
  '钩钩小指头~你就会幸福一辈子哦',
  '只想这辈子陪在你身边,只因为我爱你',
  '45°仰望天空的那一瞬间，我的眼中没有色彩',
  '初恋不是感冒，来了一次又一次',
  '爱情是要命的东西，总是让我们迷失自己',
  '青春不在，我拿什么资本再给你抖擞爱情',
  '同学~偶来踩勒~祝你好心情哦',
  '人生迷迷茫茫,只为了与你相遇',
  '笨蛋~我决定爱你一辈子',
  '人生难得有几个知己，遇见你们是我一辈子',
  '整颗心都装满了你, 再也容不下第二个人了',
  '要幸福的度过每一天，星星也会跟你说幸福',
  '中秋夜语寄相思,带去问候和思恋',
  '承诺始终是一句话而已，保证不了幸福',
  '最有魅力的人是康師傅，每天都有人泡 ',
  '孤独和悲伤，总是在迷离的季节中上演',
  '听雨的声音，去搜寻记忆中的一段回忆',
  '吥清楚还能陪着妳多久丶但妳若安好俄吥在也罢',
  '判处你快乐无期徒刑~没收全部寂寞与烦恼',
  '年华是时间的痕迹，我们是路的踪迹',
  '些能容忍妳的无理取闹、任性的人、叫做嗳人',
  '前一秒，我在想你~下一秒，我会陪你 ',
  '某人以及某人，希望你们幸福快乐！',
  '深深地想念，浓浓的爱意，蜜蜜的言语，醉了他的情',
  '一生知己不多，就有你~问候时不许少了我！',
  '下一场快乐雨，洗去你所有的烦恼；刮一场如意风，',
  '幸福很简单、简单到时间一冲就冲淡！',
  '坚强点，没有走不过去的路，走过去便一马平川！',
  '再烦：也别忘记微笑；再苦：也别忘坚持；再累：也 ',
  '流年里，我的爱在默默地等你，因为有爱的生活是开',
  '那个时候的天空很蓝，很宽，于是我们就开始向往天',
  '有时，被惦记是很开心的事，有时，被关心是很温暖 ',
  '思念你，是我自然的习惯；牵挂你，是我温馨的涌泉',
  '有谁知道外表看似坚强的我却是一个软弱的人呢',
  '有些人、一转身就会失去！好好珍惜你身边的每一个 ',
  '那一年wo们曾一起走过、俄还是一样的爱你',
  '当你看到这条空间留言时你眼前满天的星星就是我给'
];

// 随机昵称
var RANDOM_NICKS = [
  '逆着光悲伤°','金少爷','声浪荡','我的心丶好冷','孤家寡人°',
  '一分钟的、自由','正在输入...','嘟嘟嘟、占线中……','夜林深处燃青灯','←龙霸天下`',
  '陌路、愛已灭','久夏青','淡忘回忆','Unfair','耍酷是爷的资本',
  '旧新欢','▎對於你 ，硪只能選回忆','雨夜孤云','→妞乄迷夨le','硬茬子',
  '编造着梦想','止不住、那流逝的年华','女人就该视男人为粪土','勿语','妳來喚醒',
  'TRY，舞台··','ぺ佳日摓jūnㄣ','紅顏禍水丶','︶ 葆Ⅱㄣ','本殊繁华界。','我是女皇不落泪',
  'Panda','Joelan','Michale','Jane','Beattles','Sakai','Cuba','Monica','beyond','Zard','Trump','yw96'
];

var renderTpl = function(tpl) {
  var COMMENTS_LEN = RANDOM_CONTENTS.length;
  var NICKS_LEN = RANDOM_NICKS.length;
  var randcomment_idx = Math.floor(COMMENTS_LEN * Math.random());
  var randnick_idx = Math.floor(NICKS_LEN * Math.random());
  var randComment = RANDOM_CONTENTS[randcomment_idx];
  var randNick = RANDOM_NICKS[randnick_idx];
  var randMap = {
    '%随机数字%': Math.floor(Math.random() * 10000),
    '%随机内容%': randComment,
    '%当前时间%': new Date().toLocaleTimeString(),
    '%随机昵称%': randNick
  };
  Object.keys(randMap).forEach(function(e) {
    tpl = tpl.replace(e, randMap[e]);
  });
  
  return tpl;
};

// 对localStorage进行操作管理
var ls = {
  QQ_ZAN: {
    getTask() {
      var qqs = [];
      try {
        qqs = JSON.parse(localStorage['QQ_ZAN'] || '[]');
      } catch(err) {
        localStorage['QQ_ZAN'] = "[]";
      }
      return qqs;
    },
    clear() {
      localStorage['QQ_ZAN'] = "[]";
    },
    addTask(qs) {
      var qqs = JSON.parse(localStorage['QQ_ZAN'] || '[]');
      qqs = qqs.concat(qs);
      localStorage['QQ_ZAN'] = JSON.stringify(qqs);
    },
    removeTask(qs) {
      var qqs = JSON.parse(localStorage['QQ_ZAN'] || '[]');
      qs.forEach(function(e, idx) {
        if (qqs.indexOf(e) > -1) {
          qqs.splice(idx, 1);
        }
      });
      localStorage['QQ_ZAN'] = JSON.stringify(qqs);
    }
  },
  QZONE_LIULAN: {
    getTask() {
      var qqs = [];
      try {
        qqs = JSON.parse(localStorage['QZONE_LIULAN'] || '[]');
      } catch(err) {
        localStorage['QZONE_LIULAN'] = "[]";
      }
      return qqs;
    },
    clear() {
      localStorage['QZONE_LIULAN'] = "[]";
    },
    addTask(qs) {
      var qqs = JSON.parse(localStorage['QZONE_LIULAN'] || '[]');
      qqs = qqs.concat(qs);
      localStorage['QZONE_LIULAN'] = JSON.stringify(qqs);
    },
    removeTask(qs) {
      var qqs = JSON.parse(localStorage['QZONE_LIULAN'] || '[]');
      qs.forEach(function(e, idx) {
        if (qqs.indexOf(e) > -1) {
          qqs.splice(idx, 1);
        }
      });
      localStorage['QZONE_LIULAN'] = JSON.stringify(qqs);
    }
  },
  QZONE_COMMENT: {
    getTask() {
      var qqs = [];
      try {
        qqs = JSON.parse(localStorage['QZONE_COMMENT'] || '[]');
      } catch(err) {
        localStorage['QZONE_COMMENT'] = "[]";
      }
      return qqs;
    },
    clear() {
      localStorage['QZONE_COMMENT'] = "[]";
    },
    addTask(task) {
      var tasks = JSON.parse(localStorage['QZONE_COMMENT'] || '[]');
      tasks = tasks.concat(task);
      localStorage['QZONE_COMMENT'] = JSON.stringify(tasks);
    },
    removeTask(qs) {
      var tasks = JSON.parse(localStorage['QZONE_COMMENT'] || '[]');
      var qqs = tasks.map(e => e.qq);
      qs.forEach(function(e, idx) {
        if (qqs.indexOf(e) > -1) {
          tasks.splice(idx, 1);
        }
      });
      localStorage['QZONE_COMMENT'] = JSON.stringify(qqs);
    }
  }
}

function checkQQ(qq) {
  return /^\d{5,10}$/.test(qq);
}

function Log(title, value) {
  console.log("============="+title+"================");
  console.log(JSON.stringify(value));
  console.log("======================================");
}



function sign(params) {
  var s = 'MZZ';
  s += params.qq.trim();
  s += params.num;
  s += params.type;
  s += 'mzz';
  return MD5(s).toUpperCase();
}

export default {
  renderTpl: renderTpl,
  ls: ls,
  checkQQ: checkQQ,
  Log: Log,
  sign: sign
};