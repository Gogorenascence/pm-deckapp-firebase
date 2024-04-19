import summon from "./summon.wav"
import destroy from "./destroyed.wav"
import draw from "./draw.wav"
import shuffle from "./shuffle.wav"
import special from "./specialsummon.wav"
import gain from "./gainlp.wav"
import activate from "./activate.wav"
import set from "./set.wav"
import equip from "./equip.wav"
import discard from "./discard.wav"
import menu from "./menu.wav"
import gameStart from "./nextturn.wav"
import flip from "./flip.wav"
import damage from "./damage.wav"
import roll from "./diceroll.mp3"
import chat from "./chatmessage.wav"
import loaded from "./playerenter.wav"


export function soundLoop(sound, loopCount, time) {
    let playCount = 0

    const looper = () => {
        if (playCount < loopCount) {
            sound()
            playCount++
            setTimeout(looper, time*1000)
        }
    }
    looper()
}

export function gainSound(volume) {
    const audio = new Audio(gain);
    audio.volume = volume
    audio.play()
}

export function summonSound(volume) {
    const audio = new Audio(summon);
    audio.volume = volume
    audio.play()
}

export function drawSound(volume) {
    const audio = new Audio(draw);
    audio.volume = volume
    audio.play()
}

export function shuffleSound(volume) {
    const audio = new Audio(shuffle);
    audio.volume = volume
    audio.play()
}

export function destroySound(volume) {
    const audio = new Audio(destroy);
    audio.volume = volume
    audio.play()
}

export function specialSound(volume) {
    const audio = new Audio(special);
    audio.volume = volume
    audio.play()
}

export function activateSound(volume) {
    const audio = new Audio(activate);
    audio.volume = volume
    audio.play()
}

export function discardSound(volume) {
    const audio = new Audio(discard);
    audio.volume = volume
    audio.play()
}

export function menuSound(volume) {
    const audio = new Audio(menu);
    audio.volume = volume
    audio.play()
}

export function startSound(volume) {
    const audio = new Audio(gameStart);
    audio.volume = volume
    audio.play()
}

export function equipSound(volume) {
    const audio = new Audio(equip);
    audio.volume = volume
    audio.play()
}

export function flipSound(volume) {
    const audio = new Audio(flip);
    audio.volume = volume*4
    audio.play()
}

export function damageSound(volume) {
    const audio = new Audio(damage);
    audio.volume = volume
    audio.play()
}

export function rollSound(volume) {
    const audio = new Audio(roll);
    audio.volume = volume
    audio.play()
}

export function chatSound(volume) {
    const audio = new Audio(chat);
    audio.volume = volume
    audio.play()
}

export function loadedSound(volume) {
    const audio = new Audio(loaded);
    audio.volume = volume
    audio.play()
}
