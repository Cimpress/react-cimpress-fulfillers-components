# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2020-03-19
### Added
- Added an option specify Fulfiller Identity environment

## [1.3.2] - 2019-12-04
### Fixed
- Fixed several issues with FulfillerMultiSelect and made FulfillerSelect use FulfillerMultiSelect to reduce code duplication

## [1.3.1] - 2019-11-13
### Fixed
- Added call to update most recent fulfillers in Customizr when the fulfillerId was provided in props.

## [1.3.0] - 2019-11-07
### Added
- Added `selectedFulfillerId` property to `FulfillerSelect` component, allowing setting of the selected fulfiller externally

## [1.2.2] - 2019-06-25
### Update
- Update dependencies

## [1.2.1] - 2019-05-09
### Update
- Update dependencies

## [1.2.0] - 2019-04-12
### Added
- `FulfillerSelect` and `FulfillerMultiSelect` now provide an option to filter rendered fulfillers. Added 'fulfillersFilferFunction' property.

## [1.1.0] - 2019-04-09
### Added
- New component: `FulfillerMultiSelect`

## [1.0.2] - 2019-02-27
### Fixed
- Fix the bug which even with `autoSelectMostRecent` set to `false` onChange handler is called.

## [1.0.1] - 2019-02-25
### Fixed
- Fix the prop name (it should have been `autoSelectMostRecent`)

## [1.0.0] - 2019-02-21
### Fixed
- Skip cache on fulfiller data.
### Added
- Property to enable/disable preselection of the most recent fulfiller (autoSelectMostRecent)

## [0.5.18] - 2019-01-28
### Fixed
- Better handle the case where no recent fulfillers exist and/or no fulfillers are available

## [0.5.17] - 2019-01-28
### Fixed
- Fix regeneratorRuntime in a proper way.

## [0.5.16] - 2019-01-25
### Fixed
- Fix regeneratorRuntime is not defined.

## [0.5.15] - 2019-01-17
### Fixed
- Update dependencies to better handle slow connects when fulfillers cannot be retrieved within timeout

## [0.5.14] - 2018-12-12
### Fixed
- Fix Cannot read property 'fulfiller' of null

## [0.5.13] - 2018-12-04
### Fixed
- Do not use reactI18nextModule from react-i18next

## [0.5.12] - 2018-12-04
### Fixed
- Do not call customizr in case of no token available

## [0.5.11] - 2018-12-03
### Fixed
- Updated dependency to address issue with users with no preferences (customizr)

## [0.5.10] - 2018-10-24
### Fixed
- Move storybook to dev dependency

## [0.5.9] - 2018-10-24
### Changed
- Increase `cimpress-fulfiller-identity` version to 0.1.10

## [0.5.8] - 2018-10-19
### Changed
- Updated development workflow, no functional change

## [0.5.7] - 2018-10-19
### Changed
- Increase `cimpress-fulfiller-identity` version to 0.1.8

## [0.5.6] - 2018-10-12
### Changed
- Dependencies updates, no functional change

## [0.5.5] - 2018-09-20
### Fixed
-  FulfillmentLocationList fix can not read property length of null
-  FulfillmentLocationListItem fix search characters highlighting issue, invalid regular expression

## [0.5.2] - 2018-07-20
### Fixed
- Move react and @cimpress/react-components as peer dependencies

## [0.5.0] - 2018-07-20
### Changed
- Change the object passed as an argument to props.onChange() to a plain fulfiller object
### Fixed
- Fix component not firing props.onChange() in certain cases
- Refresh list of fulfillers together with list of recently selected fulfillers when new props.accessToken is passed

## [0.4.5] - 2018-07-16
### Added
- Support recent fulfillers for FulfillerSelect component

## [0.3.1] - 2018-06-05
- Update cimpress-fulfiller-identity package to address an issue preventing minifying

## [0.3.0] - 2018-06-05
- Added FulfillerSelect component with support for calling Fulfiller Identity and Fulfillment Location services
- Added language property (defaulting to 'eng') to all components

## [0.2.0] - 2018-05-16
Simplified and renamed.

## [0.1.0] - 2017-11-20
### Added
- FulfillmentLocationItem component
- FulfillmentLocationList component
