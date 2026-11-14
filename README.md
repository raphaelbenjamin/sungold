# sungold

sungold is a macOS app for learning languages by reading, listening and practising vocabulary. It builds on Umbra and the original [Lumen](https://github.com/LivingTwice/lumen) project.

## Open the app on macOS

Double-click **sungold.app** in Finder. For everyday use, drag it into **Applications**, then open **sungold** from Spotlight. Choose **Get started** and select a study language. The first launch starts a fresh library. Use **Import** to add a text or file, then open it in the Library. Use **Training Dojo** to practise saved words.

sungold stores its desktop library in `~/Library/Application Support/com.raphaelbenjamin.sungold` on macOS. Backup destinations use a separate `sungold` folder. This local build uses ad hoc signing, and updates are installed by replacing the sungold app bundle.

## Build from source

Install Node.js, Rust, CMake and the Xcode Command Line Tools on Apple silicon. From this checkout run:

```sh
npm ci
npm --prefix prototype ci
npm run app:build -- --bundles app
```

Open `src-tauri/target/release/bundle/macos/sungold.app`. For the synthetic browser preview, see the [prototype guide](prototype/README.md).

sungold and its original kiwi artwork are licensed under [GPL-3.0-or-later](LICENSE). The existing source retains its Umbra and Lumen attribution. See the [interface credits](prototype/THIRD_PARTY.md) for third-party components.
