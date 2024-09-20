## Description

This Solution is made using [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

> The framework is known to be opinionated but still flexible so I will point out to the code sections that hold the logic of the solution.

### BaseProvider

This is an abstract class that holds a common logic shared between providers of diffrent exchanges. each exchange provider/client needs to open a socket connection and handles received messages, and / or set up a polling mechanism using restfull Api calls.
This class handles that by abstracting callback functions used durring the previously mentioned actions.
This class should also impliment a fallbach mechanism when a connection with the exchange server is lost or intorrupted .

Having this class will allow us to easily add any futer provider with ease by keeping a unified interface and a flexible implimentation for each exchange requirements.

> due to the possibility of taking too much time, the fallback mechanism
> wasn't implimented in the best way, and kept simple by changing the
> end point when something happens (I kept in mind that the solution should be doable in 2 hours, so I didn't want to go into too much detailed implimentation).

### Exchange Providers

Providers such **KrakenProvider** extends the **BaseProvider** then imliments the necessary functions that allows it to fetch the data from the api server, Uppon data reception, it gets formated, calculated and ready to be stored!

### The Store

The **Store** service is a simple in memory data structure (Map) that holds the latest calculated mid price value for each symbole for each exchange. It's a mocked representation of a Redis database in a real life scenario.

### Unit tests

To avoid repetition, only BinanceProvider and it's formatter functions were tested

### Usage

Feel free to monitor the prices in the console (via a simple in house logger)
[![Imgur Video Thumbnail](https://i.imgur.com/jAJTkyT.png)](https://i.imgur.com/wHMagYb.mp4)

Or through the swagger ui
[http://localhost:3000/api#](http://localhost:3000/api#/default/MidPriceIndexController_findOne)

![swagger](https://i.imgur.com/nfm9dKp.png)

## Installation

```bash

$  npm  install

```

## Running the app

```bash

# development

$  npm  run  start



# watch mode

$  npm  run  start:dev



```

## Test

```bash

# unit tests

$  npm  run  test



# test coverage

$  npm  run  test:cov

```
