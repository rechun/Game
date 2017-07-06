/*定义游戏

   game：游戏本身的对象
   玩家：players:[]
   poker：[]
   start:[]

*/var poker = {
	cards:[],
	/*洗牌*/
	shuffle: function (){
		this.cards.sort(function(){
			return Math.random()<0.5? 1:-1;
		})
	},
	/*初始化*/
	init:function(){
		var huases = ["@","#","$","&"];
		var points = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
		for (var i = 0;i<huases.length;i++){
			for (var j = 0;j<points.length;j++){
				var card = new Cards(huases[i],points[j]);
				this.cards.push(card); 
			}
		}
		this.cards.push(new Cards("","king"))
		this.cards.push(new Cards("","little"))
	}

}


   var game ={
   	    players :[new Player("FIRST"), 
   	    new Player("SECOND"),
   	    new Player("THREE")],
   	    poker :poker,   	    
   	    start : function (){
   	    	/*初始化*/
   	    	this.poker.init();
   	    	/*洗牌*/
   	    	this.poker.shuffle();

   	    	/*发牌*/
   	    	this.sendCards();
   	    	/*show牌*/
   	    	this.showCards();

   	    },
   	    sendCards :function(){
   	    	for (var i =0; i < 51;i++ ){
   	    		this.players[i % 3].cards.push(poker.cards[i]);
   	    	}
   	    },
   	    showCards :function(){
   	    	for (var i=0;i<this.players.length;i++){
   	    		console.log(this.players[i].name +":"+this.players[i].cards.join("=="));
   	    	}
   	    }
   	}
   	game.start();

   	function Player(name){
   		this.name = name;
   		this.cards = [];
   			}
   	function Cards(huase,point){
   		this.huase = huase;
   		this.point = point;
   		this.toString = function(){
   			return this.huase + this.point;
   		}

   	}		