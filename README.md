 # RegexTube
 
 <h1 align="center">
  <br>
  <img src="https://github.com/smuecke/regextube/blob/master/icons/regextube-256.png" alt="RegexTube" width="200">
</h1>
<h4 align="center">A browser addon for filtering the YouTube subscription feed using regular expressions</h4>

RegexTube is an addon for Firefox that allows to filter the [YouTube subscription feed](https://www.youtube.com/feed/subscriptions) using regular expression following the [JavaScript standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). 

* filter by channel name and video title (**blacklist**)
* invert filter, so only videos that *do not* match are displayer (**whitelist**)
* easily enable and disable filter rules

## Usage

![Popup](https://i.imgur.com/e0G6HiS.png)

This is the popup menu allowing you to enter regexes. Both *channel* and *title* can be regular expressions. A video matches a line within the list of regular expression if both *channel* and *title* match. Checking the *invert* checkbox only inverts the *title* expression, not the *channel*. A video is hidden if it matches one or more lines.

Some more examples for regular expressions:

| channel | title | invert | comment |
| --- | --- | --- | --- |
| `foo` | `bar` | false | will hide every video with a title containing `bar` by any channel whose name contains `foo` |
| `foo` | `bar` | true | will hide every video with a title **not** containing `bar` by any channel whose name contains `foo` |
| `^foo$` | `bar` | false | will hide every video with a title containing `bar` by the channel with the exact name `foo` |
| `.*` | `ba[rz]` | true | will only show videos whose titles contain `bar` or `baz`, regardless of the channel |
| `LP$` | `.*` | false | will hide every video by channels whose names end in `LP`. But why would you subscribe in the first place? |

## Installation

Currently RegexTube is not officially published and can only be manually installed. Note that the plugin was only tested on Firefox Quantum 60.0.2 (64-bit) on a Ubuntu system, also it is not signed, so Firefox will display a warning before installing.

This easy installation will probably work:

1. Download `RegexTube.xpi` from this repository
2. Continue with step 4 below

You also might want to pack the addon yourself, e.g. after you modified it:

1. Clone `https://github.com/smuecke/regextube.git` to your computer to a directory `regextube`
2. Select all files within `regextube` (except for `README.md` and the old `RegexTube.xpi` file) and compress them to a .zip file
3. Select the .zip file, press `F2` and change the file name to `RegexTube.xpi`
4. In Firefox, open the Addons menu (e.g. by typing `about:addons` in your URL bar)
5. Click on the gear symbol near the top and select *install addon from file*, then choose `RegexTube.xpi`
6. Confirm that you want to add the addon

I might get RegexTube licensed in the future.

## License

MIT © [Sascha Mücke](https://github.com/smuecke)
