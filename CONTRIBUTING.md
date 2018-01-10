Contributing to BitHodl
=======================

We're glad that you'd like to help us make BitHodl even better. But first,
read these guidelines and instructions.

## Setting up the environment

### Install Node.js and npm

Install [Node.js](https://nodejs.org) (`v8`) using [nvm](https://github.com/creationix/nvm):

	$ nvm install v8

### Install Xcode

Download and install Xcode from
[developer.apple.com](https://developer.apple.com/xcode/).

### Clone the repository

	$ git clone https://github.com/blockfirm/bithodl-app.git
	$ cd bithodl-app

### Install dependencies

	$ npm install
	$ npm install -g react-native-cli
	$ react-native link

## Coding conventions

Follow the coding conventions defined in [.eslintrc](.eslintrc).
Run `npm run lint` to verify that your code follows the rules.

### EditorConfig

Use [EditorConfig](http://editorconfig.org/) so that your code automatically
comply with our coding style.

## Submitting pull requests

When submitting pull requests, please follow these rules:

* Make sure there isn't another pull request that already does the same thing
* Make sure you've followed our [coding conventions](#coding-conventions)
* Provide tests for your code
* [Run the tests](#testing) before submitting
* Follow the [commit message conventions](#commit-message-guidelines)
* Rebase your commits if possible
* Refer to a GitHub Issue
* Include instructions on how to verify/test your changes
* Include screenshots for GUI changes

### Commit message conventions

* Briefly describe what your changes does
* Use the imperative, present tense: "change" not "changed" nor "changes"
* Capitalize the first letter
* No dot (.) at the end

## Testing

We're using [Jest](https://facebook.github.io/jest/) to test all JavaScript code.
Always run the tests before and after you start changing the code. This will
ensure high quality of the code. Also write new tests when needed and be sure to
follow our [test conventions](#test-conventions) when writing them.

	$ npm test

### Testing conventions

* Put all tests in the `__tests__` folder with the same folder structure as in `src/`
* Put all mocks in the `__mocks__` folder
* Give the file the same name as the file under test, but append `.test`, e.g. `App.test.js`
* If you are unsure, read this post on [how to write good unit tests](http://blog.stevensanderson.com/2009/08/24/writing-great-unit-tests-best-and-worst-practises/)

### Code coverage

Aim for 100% code coverage when writing tests. Run the following command to
display the current code coverage:

	$ npm run test-coverage

## Releases

We're using the [Semantic Versioning Specification](http://semver.org/) when
releasing new versions.

## Roadmap

We're using [Issues](https://github.com/blockfirm/bithodl-app/issues) on
GitHub to plan our milestones. That include new features as well as bug fixes.

## Reporting security issues

We appreciate all security related reports. Please send them to <hello@bithodl.com>.

## Reporting bugs

To report a bug or another issue, please [submit a new issue](https://github.com/blockfirm/bithodl-app/issues/new) on GitHub.

Describe your issue with steps of how to reproduce it, and if not obvious, what
the expected behavior should be. Also include information about your system
(e.g. version and OS) and your setup.

## Discussion and feedback

As there are no channels set up for general discussion, we are using
[GitHub Issues](https://github.com/blockfirm/bithodl-app/issues) for now.
Tag your issue as a `Question`. You can also tweet us at [@bithodl](https://twitter.com/bithodl).
