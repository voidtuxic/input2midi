# input2midi

Useless tool to transform any physical input into a midi signal output through a
virtual port. Works on MacOS >= 10.13.x, should work on Linux with JACK, but
untested. Should gracefully (no) crash on Windows.

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
- MacOS >= 10.13.x (might work under, wouldn't count on it)
- (yarn prefered)

## Usage

- Take a look at `input.json.sample` to see how to config your inputs. Copy it
  as `input.json`, it will be read as the config.
- launch app with `yarn start`
- on first launch, you will have to authorize system mods for your terminal :
  System Prefs > Security & Privacy > Privacy tab > Accessibility > tick you
  terminal app in the list. App will exit on first launch, so relaunch it.
- Once launched, you can open any software that accepts midi in (like Logic,
  Ableton Live, Magic Performer, ...) and use input "input2midi" which should
  automatically be detected OS wide. Your configured inputs should send the
  messages correctly as long as the app runs, even if your terminal isn't the
  focused app.

## Config

### mousemove

You can configure x and y to be axis for now :

```json
"mousemove": {
  "x": {
    "type": "axis", // other types will come
    "note": 9, // note using the default midi scale
    // coordinates are mapped between these values
    // from left to right for horizontal and top to bottom for vertical
    "range": [0, 127]
  }
}
```

### keydown

You can configure most keyboard keys to respond to a press. Check
[`keyConvert.macos.js`](./keyConvert.macos.js) to get a full list of available
keys.

```json
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
- (if there's a solution for Windows, I'll look into it, right now, this OS can
  go home, sorry)

## Contributing

If you wish to participate to this repo, knock yourself out, I'll gladly look at
any PR. It's kinda more of a POC though, so expect it to change a lot.
