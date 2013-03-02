// 古いブラウザ対策(IE ~8など)
if(!Array.isArray) {	
	Array.isArray = function (vArg) {	
		return Object.prototype.toString.call(vArg) === "[object Array]";	
	};	
}

// トランプ管理用クラス
var PlayingCards = function() {
	// 表示用
	this.suits = new Array('♠','♥','♦','♣');
	this.cards = new Array('A','2','3','4','5','6','7','8','9','10','J','Q','K');

	// 山札
	this.deck = new Array(
		 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12, // スペード
		13,14,15,16,17,18,19,20,21,22,23,24,25, // ハート
		26,27,28,29,30,31,32,33,34,35,36,37,38, // ダイヤ
		39,40,41,42,43,44,45,46,47,48,49,50,51	// クラブ
	);

	// 捨て札
	this.discards = new Array();

	// 山札の残り枚数
	this.remain = function (){
		return this.deck.length;
	}

	// 捨て札と山札を合せてシャッフルする
	this.init = function() {
		this.back(this.discards);
		this.shuffle();
	}

	// 山札をシャッフルする
	// 山札にあるだけのカードが対象なので、全てのカードをシャッフルする場合には
	// このメソッドを実行する前にカードを山札に戻す
	this.shuffle = function() {
		for(i=0;i<this.deck.length;i++) {
			// 交換する相手のインデックス
	 	 	var j = Math.floor(Math.random()*this.deck.length);
			var tmp = this.deck[i];
			this.deck[i] = this.deck[j];
			this.deck[j] = tmp;
		}
	} 

 // 山札から指定枚数引く
	this.draw = function (num) {
		var ret = new Array();
		for(i=0;i<num;i++) {	
			// 山札の先頭から1枚取りだして戻り値に追加する
			ret.push(this.deck.shift());
		}
		return ret;
	}

	// カードを捨てる
	this.discard = function (cards) {
		if(Array.isArray(cards)) {
			for(var i=0;i<cards.length;i++) {
				this.discards.push(cards[i]);
			}
		}else{
			this.discards.push(cards);
		}
	}

	// 山札の最後にカードを追加する
	this.back = function (cards) {
		if(Array.isArray(cards)) {
			for(var i=0;i<cards.length;i++) {
				this.deck.push(cards[i]);
			}
		}else{
			this.deck.push(cards);
		}
	}

	// カードのスートと表示文字を取得する
	this.card_info = function (card_no) {
		var suit = this.suits[Math.floor(card_no / 13)]; // カード番号を13で割る(0~3)
		var num = this.cards[card_no % 13];							// カード番号を13で割った余り(0~13)
		return new Array(suit,num);
	}

	// 山札や手札をスート、数字順に並べ替える
	// スート、数字順に番号を振っているので、普通にソートするだけで良い
 	this.sort = function ( cards ) {
			return cards.sort;
	} 
}

