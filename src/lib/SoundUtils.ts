import { Sound, PlayOptions } from "@pixi/sound";

const soundLib: { [key: string]: Sound } = {};

export function playSound(source: string, options?: PlayOptions) {
    let sound = soundLib[source];
    if (!sound) {
        soundLib[source] = sound = Sound.from(source);
    }
    return Promise.resolve(sound.play(options));
}
