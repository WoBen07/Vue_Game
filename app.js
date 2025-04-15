function calcDamage(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}


const app = Vue.createApp({
    data(){
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            log: []
        }
    },
    methods: {
        attackMonster(){
            this.currentRound++;
            let damage = calcDamage(5, 12);
            this.monsterHealth -= damage;
            this.addLogMessage('player', 'attack', damage)
            this.attackPlayer();
        },
        attackPlayer(){
            let damage = calcDamage(8, 15);
            this.playerHealth -= damage;
            this.addLogMessage('monster', 'attack', damage)
        },
        specialAttackMonster(){
            this.currentRound++;
            let damage = calcDamage(10, 25);
            this.monsterHealth -= damage;
            this.addLogMessage('player', 'special attack', damage)
            this.attackPlayer()
        },
        healPlayer(){
            let heal = calcDamage(8, 20);
            if (this.playerHealth + heal > 100){
                this.playerHealth = 100;
            }else {
                this.playerHealth += heal;
            }
            this.currentRound++;
            this.addLogMessage('player', 'heal', heal)
            this.attackPlayer();
        },
        startNewGame(){
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRound = 0;
            this.winner = null;
            this.log = []
        },
        surrender(){
            this.winner = 'monster'
            this.playerHealth = -1;
        },
        addLogMessage(who, what, value){
            this.log.unshift({
                action: who,
                actionType: what,
                actionValue: value
            })
        }
    },
    computed: {
        monsterBarStyles(){
            if (this.monsterHealth < 0){
                return {width: '0%'}
            }else {
                return {width: this.monsterHealth + '%'}
            }
        },
        playerBarStyles(){
            if (this.playerHealth < 0){
                return {width: '0%'}
            }else {
                return {width: this.playerHealth + '%'}
            }
        },
        mayUseSpecialAttack(){
            return this.currentRound % 3 !== 0
        },
        mayHeal(){
            return this.currentRound % 2 !== 0
        }
    },
    watch: {
        playerHealth(value){
            if (value <= 0 && this.monsterHealth <= 0){
                this.winner = 'draw'
            } else if (value <= 0){
                this.winner = 'monster'
            }
        },
        monsterHealth(value){
            if (value <= 0 && this.playerHealth <= 0){
                this.winner = 'draw'
            } else if (value <= 0){
                this.winner = 'player'
            }
        }
    }
});

app.mount('#game')