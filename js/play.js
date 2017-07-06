/*
对象： game：游戏本身的对象
       单例模式；对象字面量
        属性和方法：
        players：存储所有玩家  []
        poker : 存储游戏需要的扑克牌
        start ：方法；表示开启游戏
========================================

       player：玩家
         name:玩家的姓名
         cards:存储玩家发到的牌   []


========================================       
       poker：一副扑克牌
         cards:存储一副扑克牌的所有牌
         shuffle:洗牌的功能
========================================    
       card：扑克牌中的扑克
          花色：表示扑克牌的花色
          point:扑克牌的点数

 */
/*扑克对象*/
var poker = {
	cards:[],
    shuffle:function (){
    	this.cards.sort(function(a,b){
    		/*随机*/
    		return Math.random()>0.5 ? 1 : -1 ;
    	})

    },
    /*给扑克牌初始化54张*/
    init:function(){
    	var huases =["♣","♦","♥","♠"];
    	var points = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
    	for (var i =0;i<huases.length;i++){
    		for (var j = 0;j<points.length;j++){
    			var card = new Card(huases[i],points[j]);
    			this.cards.push(card);
    		}
    	}
    	this.cards.push(new Card("","king"))
    	this.cards.push(new Card("","littleking"))


    }
}

/*定义game对象*/

var game = {
	players:[new Player("book"), new Player("pen"),new Player("fruit")],
    poker:poker,
    start : function(){
    	/*初始化54张牌*/
    	this.poker.init();
    	/*先洗牌*/
    	this.poker.shuffle();
    	/*分牌*/
    	this.sendCards();
    	/*show每个玩家的牌*/
    	this.showCards();
    },

    /*牌分发到每个玩家*/
    sendCards : function(){
    	for (var i = 0;i < 51; i++){
    		this.players[i % 3].cards.push(poker.cards[i]);
    		
    	}
   },
    	/*在控制台显示每个玩家的牌*/
   showCards : function(){
   	for (var i = 0;i<this.players.length;i++){
   		console.log(this.players[i].name + ':' + this.players[i].cards.join("|,"));
   	}


   }
}
game.start();
/*游戏中的玩家*/
function Player(name){
    this.name = name;
    this.cards = [];
}

/*表示每一张扑克牌*/
function Card(huase,point){
    this.huase = huase;
    this.point = point;
    this.toString = function(){
    	return this.huase + this.point;
    }

}
