import { Sound, PlayOptions } from "@pixi/sound";

const soundLib: { [key: string]: Sound } = {};

export async function playSound(source: string, options?: PlayOptions) {
    let sound = soundLib[source];
    if (!sound) {
        soundLib[source] = sound = Sound.from(source);
    }
    return await sound.play(options);
}
