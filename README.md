# Smart Message Stream on Ethereum

Saving messages on Ethereum network with some kind of logic.

This project is part of the Hackdays Sailtrhu.

## Objectives

1. Build our first DApp (Decentralized App) on the blockchain
2. Learn Solidity programming language
3. "Replicate" our Message Stream on the blockchain
4. Make our Messages stateful and ‘smart’
  - Can’t ‘like’ a message you published

## Screenshots

<img width="700" alt="screen shot 2017-06-30 at 08 41 59" src="https://user-images.githubusercontent.com/1987013/27709447-3fad13bc-5d70-11e7-8d5a-4aadcf801eb6.png">

<img width="485" alt="screen shot 2017-06-30 at 08 47 20" src="https://user-images.githubusercontent.com/1987013/27709589-c85d6400-5d70-11e7-9930-f89252e8c883.png">

<img width="662" alt="screen shot 2017-06-30 at 08 42 08" src="https://user-images.githubusercontent.com/1987013/27709450-42d5a8ce-5d70-11e7-82d2-441dd29127e4.png">

<img width="687" alt="screen shot 2017-06-30 at 08 42 16" src="https://user-images.githubusercontent.com/1987013/27709453-44949670-5d70-11e7-8313-be6e11874939.png">

## Setup

1. `yarn install`
2. Setup a virtual machine to run `testrpc` locally
  - `git clone git@github.com:b9lab/truffle-vagrant-env.git`
  - `cd truffle-vagrant-env`
  - `vagrant up`
  - `vagrant ssh`
  - `vagrant@vagrant-ubuntu-trusty-64:~$ testrpc`
3. Compile the contracts `yarn truffle compile`
4. Deploy the contracts `yarn truffle migrate`

## Tests

`yarn truffle test`

![screen shot 2017-06-30 at 08 52 44](https://user-images.githubusercontent.com/1987013/27709773-82bbed44-5d71-11e7-8696-a394e5159b1f.png)

## Building and the frontend

1. First run `truffle compile`, then run `truffle migrate` to deploy the contracts onto your network of choice (default "development").
2. Then run `npm run dev` to build the app and serve it on http://localhost:8080 (use :8081 for live reloading)


