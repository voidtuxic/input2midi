# input2midi

Useless tool to transform any physical input into a midi signal output through a
virtual port. Works on MacOS >= 10.13.x, should work on Linux with JACK, but
untested. Works on Windows with a few tricks.

## Current limitations

As this is very WIP, there are some clear limitations. My advice would be :
don't use it right now.

- only sends Note ON midi messages with velocity
- works with node >= 8.9.x < 9.x.y . Might work with above versions but I
  wouldn't bet on it
- supported events :
  - `keydown`: press to send note
  - `mousemove` on `x` and `y` to send note with velocity as axis with a range

## Requirements

- node >= 8.9.x < 9.x.y
- python >= 2.7.2 (for node-gyp)
- a C++ compiler, may it be from xcode, vs or custom install (for node-gyp)
- MacOS >= 10.13.x (might work under, wouldn't count on it) or Windows (tested
  on 10, should be fine up to 7)
- (yarn prefered)

## Usage

- Take a look at `input.json.sample` to see how to config your inputs. Copy it
  as `input.json`, it will be read as the config.
- launch app with `yarn start`

On macOS :

- on first launch, you will have to authorize system mods for your terminal :
  System Prefs > Security & Privacy > Privacy tab > Accessibility > tick you
  terminal app in the list. App will exit on first launch, so relaunch it.
- Once launched, you can open any software that accepts midi in (like Logic,
  Ableton Live, Magic Performer, ...) and use input "input2midi" which should
  automatically be detected OS wide. Your configured inputs should send the
  messages correctly as long as the app runs, even if your terminal isn't the
  focused app.

On Windows :

- you need a midi loopback for this to work. I recommend using
  [loopMIDI](http://www.tobias-erichsen.de/software/loopmidi.html) which has an
  easy UI and allows multiple loopbacks with ease. Create at least one port,
  it'll be the one you use
- you have to select your midi output explicitly from the presented list. Use
  arrow keys to highlight the virtual port and enter to confirm
- should work fine, you can activate the virtual port on input in your midi
  software.

I made a [POC](http://www.tobias-erichsen.de/software/loopmidi.html) with a VSTi
plugged behind on Windows 10.

## Config

### mousemove

You can configure x and y to be axis for now. Check
[`keyConvert.js`](./keyConvert.js) to get a full list of available keys.

```js
"mousemove": {
  "x": {
    "type": "axis", // other types will come
    "note": 9, // note using the default midi scale
    // coordinates are mapped between these values
    // from left to right for horizontal and top to bottom for vertical
    "range": [0, 127],
    // optional : you can specify a key to hold to send message
    "activator": "ControlLeft"
  }
}
```

### keydown

You can configure most keyboard keys to respond to a press. Check
[`keyConvert.js`](./keyConvert.js) to get a full list of available keys.

```js
"b": {
  "x": {
    "type": "press", // other types will come
    "note": 9, // note using the default midi scale
    "value": 96 // velocity sent by this press
  }
}
```

## Roadmap

- support more ioHook events
- add xbox controller mappings
- support more midi message types
- add input action types like `hold` or `drag`
- add modifiers to ranges and values to modulate what value is sent to midi
- check that shitshow with ioHook keycodes

## Contributing

If you wish to participate to this repo, knock yourself out, I'll gladly look at
any PR. It's kinda more of a POC though, so expect it to change a lot.
