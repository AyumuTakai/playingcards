/**************************************************
  Javascript 配列操作サンプル
  ブラックジャックもどき
  (正式なブラックジャックのルールではありません)
***************************************************/
var dealer_area;
var player_area;

// 山札/捨て札
var playingcards = new PlayingCards();
// 親の手札
var dealer_hands;
// プレイヤーの手札
var player_hands;

// standもしくはbustしたか
var dealer_end;
var player_end;

// カード表示のためのHTML要素を作成して返す
function create_card_element(card) {
	var elm = document.createElement('div');
	var card_info = playingcards.card_info(card);

	// スート要素
	var suite_elm = document.createElement('span');
	var suit = document.createTextNode(card_info[0]);
 	suite_elm.appendChild(suit);

	// 数字要素
	var num_elm = document.createElement('span');
	var num = document.createTextNode(card_info[1]);
	num_elm.appendChild(num);

	// スートと数字要素をカードに追加する
	elm.appendChild(suite_elm);
	elm.appendChild(num_elm);
	if(card_info[0] === '♥' || card_info[0] === '♦') {
		elm.setAttribute('class','red card');	
	}else{
		elm.setAttribute('class','black card');
	}
	return elm;
}

// ゲーム開始
function game_init() {
	var deck = document.getElementById('deck');
	deck.setAttribute('class','');

	// 親の初期化
 	dealer_area = document.getElementById('dealer_area');
	var child_num = dealer_area.childNodes.length;
	for(var i=0;i< child_num;i++) {
		dealer_area.removeChild(dealer_area.firstChild);
	}
	playingcards.discard(dealer_hands);
 	dealer_hands = new Array();
	dealer_end = false;

	//  プレイヤーの初期化
	player_area = document.getElementById('player_area');
	child_num = player_area.childNodes.length;
	for(var i=0;i< child_num;i++) {
		player_area.removeChild(player_area.firstChild);
	}
	playingcards.discard(player_hands);
	player_hands = new Array();

	player_end = false;

	// 山札をシャッフルする
	playingcards.shuffle();
	// 最初に親の手番
	dealer_turn();
}

// 得点計算
function calc_score(hands){
	var score = 0;
	var a_num = 0; // Aの枚数(バスト時に減算する)

	for(var i=0;i<hands.length;i++) {
		// カード番号を13で割った余りは0~12になるので1を加えて点数とする
		var n = hands[i] % 13 + 1; 
		if(10 < n) { n = 10; } // J,Q,Kは10として扱う
		if(1 === n){ n = 11;a_num++; } // Aは11として扱う
		score = score + n;
	}
	// バストしていたらAを1として計算しなおす
	for(i = 0;i < a_num;i++){
		if( score <= 21) { // 21以下になったら終了
			break;
		}
		score = score - 10; // 11として計算していたので、10を引く 
	}
	return score;
}

// 山札からカードを1枚引く
function draw() {
	var card = playingcards.draw(1);
	if(playingcards.remain() === 0 ) {
		// 山札が無くなったら山札を非表示にする
		var deck = document.getElementById('deck');
		deck.setAttribute('class','hidden');
	}
	if (0 < card.length) {
		return card[0];
	}
	return null;
}

// 親の手番
function dealer_turn() {
	// すでにSTANDまたはBUSTしていたら何もしない
	if(dealer_end) {
		return;
	}

	// カードを引くか判断する
	// この判断を工夫すると、親が強くなる
	// Wikipediaのブラックジャックのページに攻略法が記載されている
	var score = calc_score(dealer_hands);
	if( 19 <= score ) {
		// 現在の得点が19以上なら引かない(STAND)
		dealer_end = true;
		judge();
		return;
	}
	var player_score = calc_score(player_hands);
  if (player_end && player_score < score) {
		// プレイヤーがスタンドしていて、得点が親より低ければ終了
		dealer_end = true;
		judge();
		return;
	} 

	// カードを引く
	var card = draw();
	if(card !== null ) {
		// 引いたカードを手札に追加する
		dealer_hands.push(card);

		// カードの要素を作って親エリアに追加
		var elm	= create_card_element(card); 
		dealer_area.appendChild(elm);

		if(dealer_hands.length == 4) {
			dealer_end = true;
		}
		// スコア計算
		score = calc_score(dealer_hands);
		if(score == 21) {
			msg('DEALER : BLACK JUCK!!');
			dealer_end = true;
			player_end = true;
			judge();
		}else if( 21 < score ){
			msg('DEALER : BUST!!');
			dealer_end = true;
			player_end = true;
			judge();
		}

	}
}

// プレイヤーの手番
function player_turn() {

	if(player_end) {
		return;
	}

	// カードを引いて手札に追加
	var card = draw();
	if (card) {
		player_hands.push(card);

		// カードの要素を作ってプレイヤーエリアに追加
		var elm	= create_card_element(card); 
		player_area.appendChild(elm);

		// スコア計算
		var score = calc_score(player_hands);
		if(score == 21) {
			msg('PLAYER : BLACK JUCK!!');
			player_end = true;
			judge();
		}else if( 21 < score ){
			msg('PLAYER : BUST!!');
			player_end = true;
			dealer_end = true;
			judge();
			return false;
		}

		// 四枚引いたら勝敗判定
		if(player_hands.length == 4) {
			player_end = true;
			judge();
			return false;
		}

		// 親の手番
		dealer_turn();
	}
	return false;
}

// プレイヤーがスタンドした
function stand() {
	player_end = true;

	if ( ! judge() ) {
		// 親のプレイを続行
		dealer_turn();	
	}
	return false;
}

// 勝敗判定
function judge() {

	if( ! ( player_end && dealer_end ) ){
		// まだ親とプレイヤーのどちらかがプレイ続行中
		return false;
  }
	setTimeout( function () {

		// 得点取得
		var dealer_score = calc_score(dealer_hands);
		var player_score = calc_score(player_hands);

		// バストしたか
		var dealer_bust = false;
		var player_bust = false;

		// バストのチェック
		if ( 21 < dealer_score) {
			dealer_bust = true;
		}
		if ( 21 < player_score ){
			player_bust = true;
  	}

		if ( ! ( dealer_bust || player_bust ) ) {
			// 両者共にバストしていない 
			if(dealer_score == player_score) {
				alert('DRAW');
			}else if(dealer_score < player_score){
				alert('PLAYER WIN');
			}else{
				alert('DEALER WIN');
			}
  	}else if( player_bust ) {
			alert('DEALER WIN');
  	}else if( dealer_bust ) {
			alert('PLAYER WIN');
		}else{
			alert('DRAW GAME');
		}
		game_init();
	},1);
	return true;
}

// カード描画後にメッセージを表示させるため、
// setTimeoutで処理を遅延させる
function msg(str) {
	setTimeout(function (){ alert(str); },1);
}
