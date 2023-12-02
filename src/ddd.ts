import { UserModel } from "./data/repository/database/models/user"
import WalletRepository from "./data/repository/wallet/wallet";

export const runDBMigration = async () => {
    // const walletRepo = new WalletRepository();
    // const users = await UserModel.find();
    // if (!users) return;
    // for (const user of users) {
    //     for ( let w = 0; w < user.wallets.length; w++) {
    //         user.wallets[w].private_key = walletRepo.encryptToken(user.wallets[w].private_key);
    //     }
    //     await user.save();
    //     console.log(user.wallets);
    // }
}

// [
//     {
//       private_key: 'c64232d69cbf7bc0f77d7bda002acfb11ece5693d98612be72ffe310cc658465',
//       address: '0xeb26454D0F02fDdFA93cC938B30c5b1Fb2c91B90',
//       balance: 0,
//       _id: new ObjectId("65025c6a2663c2e7e12fbaae"),
//       others: []
//     },
//     {
//       private_key: '7fc98bac69657aac2c15b7cf2407eb866eaa7a126a114b3148b74dd86ecea26f',
//       address: '0xb462Ac4DeAD75F4E44F4221000fE1b7660B4F779',
//       balance: 0,
//       _id: new ObjectId("65025c6a2663c2e7e12fbaaf"),
//       others: []
//     }
//   ]
//   [
//     {
//       private_key: '909aa9397b3a718565210ff2ab2e763e97b060065db5540cc4204e86505c2ce1',
//       address: '0x78B05653cBF1314Bd2C9a70C76b0B75523d92a62',
//       balance: 0,
//       _id: new ObjectId("650257e6c7138fb6f1722845"),
//       others: []
//     }
//   ]
//   [
//     {
//       private_key: '0xfdf8ff23bb6d8106013c335bb55e8cec1360a3794c8e4331d015c0e5f64ab282',
//       address: '0xdea85D4eca830fFfd8C63631089FA0FcC27eeC77',
//       others: [ [Object], [Object], [Object] ],
//       _id: new ObjectId("656673180d41ed4c47a79a58")
//     },
//     {
//       private_key: '0xe7c906d75d055e815e28d28f8a572b21b506d15edb7aee6188a210c8e14f1ede',
//       address: '0x78a7f2cFd2A217863F8f6C6919498A1f83509130',
//       others: [],
//       _id: new ObjectId("656673180d41ed4c47a79a5c")
//     },
//     {
//       private_key: '0xe1976abcd0e41419e6e27830e3a1f147c105a49d4c4bf2c087003a07b8cd9af3',
//       address: '0x81F474B98aF30CF15c777e2EDdc5359913c4A254',
//       others: [],
//       _id: new ObjectId("656673180d41ed4c47a79a5d")
//     }
//   ]
//   [
//     {
//       private_key: '0x19868190f4a2afdeae1c6e7e5137e5bb200cc53af7d24c3498426d6f84beb52d',
//       address: '0x589B1454dD0F4c59eD98Ac2d84f8fD08a0FaD858',
//       balance: 0,
//       _id: new ObjectId("6508371e528e67f629defb14"),
//       others: []
//     },
//     {
//       private_key: '0xdb9ba9b13b61abbae8f22d3d1619ffadfc9c3911594c233c6d7621be0bc9baf7',
//       address: '0x04d8c61bB5C154D56393b1006C2bac1Fed77B983',
//       balance: 0,
//       _id: new ObjectId("6508371e528e67f629defb15"),
//       others: []
//     },
//     {
//       private_key: '0x18f5aa5e7916537ee8565d99e8a8141578f040e031cf7a323ae1f318821301dc',
//       address: '0xBc5dEa99e4251A564C1Ac6BE7232db8Aec389B7c',
//       balance: 0,
//       _id: new ObjectId("6508371e528e67f629defb16"),
//       others: []
//     }
//   ]
//   [
//     {
//       private_key: '0x0b164885f3f7266a340cae197196725bb8af16d088187252f5f70aa904ee6aec',
//       address: '0x92d988d9120CEa56d96Efdfda22D2E89ff9fBe4B',
//       others: [],
//       _id: new ObjectId("655744831c478d31a5f150a8")
//     },
//     {
//       private_key: '0xfdf8ff23bb6d8106013c335bb55e8cec1360a3794c8e4331d015c0e5f64ab282',
//       address: '0xdea85D4eca830fFfd8C63631089FA0FcC27eeC77',
//       balance: 47000000000000000,
//       others: [],
//       _id: new ObjectId("655744b2f2577e540e53272a")
//     }
//   ]
//   [
//     {
//       private_key: '0x472c1d931c31674915d2d6379ee5a95c074d9827a7c4cee55147e9149931a1d7',
//       address: '0x2cA8616388f4a29807f3dE94CA352716347afc76',
//       balance: 0,
//       _id: new ObjectId("65043fda545714e3cb11ad29"),
//       others: []
//     }
//   ]
//   [
//     {
//       private_key: '0x0f3de890523c23defbc0f98854ae20ff0848924a209a82028eef27f36add3382',
//       address: '0x72C9A9CB250590f8156ac012E979b9aAB6Fd3436',
//       balance: 0,
//       _id: new ObjectId("650839ee528e67f629defb91"),
//       others: []
//     }
//   ]
//   [
//     {
//       private_key: '0xe7ad5c94ea6a9c9a9c0c472e33d6030a29c9fd795b16361f2f3e2c981994dd8f',
//       address: '0x94eAD4be3C58B7f19e723Ba4C1cae65579df0D70',
//       balance: 0,
//       others: [],
//       _id: new ObjectId("65123ab8efb7095e3913b5f2")
//     }
//   ]
//   [
//     {
//       private_key: '0x3e18b5274c277bac76452c2e100679a23c6c60e641df51b4c528813afa481a09',
//       address: '0x9A22d8cCcAf45Bd13fC97bEEB18D523b553363c3',
//       balance: 0,
//       others: [],
//       _id: new ObjectId("6522e5fa300e6212ac7c3fd3")
//     }
//   ]
//   [
//     {
//       private_key: '0x32a7d9543b51c5179f6e67e5d82aa849ae98ba4476d45070e1a25ce0e973b473',
//       address: '0x0339914730fC1d450B097792F3fDbCb6906aCdf8',
//       balance: 0,
//       others: [],
//       _id: new ObjectId("652667feb39557d8e09b33d9")
//     }
//   ]
//   [
//     {
//       private_key: '0x7e95bf139b229a3befa2adde90a703d12e0ebc8b3a744ddc62628794459c3e77',
//       address: '0xC5fFE18cf303f6a46Fd76907DBEf16A05d9A1414',
//       balance: 0,
//       others: [],
//       _id: new ObjectId("65285664cc6e2aa84f0d50d0")
//     }
//   ]
//   [
//     {
//       private_key: '0x0d6d39af8804f633bf50f93fbee5c0f6dffd20a87779b52c17598c43ba2bf616',
//       address: '0x97a2EBE0A024204618aaEFd43a8c745a4C78d48b',
//       balance: 0,
//       others: [],
//       _id: new ObjectId("65425d48c4e989fdee530199")
//     },
//     {
//       private_key: '0x014496aaad48c36c796d0a3e68d8137cbbecd01a9cc3cd2e5911cb2b78abb98f',
//       address: '0x7b65041ec0C1b487f0569eA3f111b6bd5Bea9c70',
//       balance: 0,
//       others: [],
//       _id: new ObjectId("65425d48c4e989fdee53019a")
//     },
//     {
//       private_key: '0xa281d68aa75bc049e98ad3cafe3f9e3a33103bd1d7beaea10ca31feba4f382a3',
//       address: '0xcADa167c28af50Df08FF425789869b5c50c7CadE',
//       balance: 0,
//       others: [],
//       _id: new ObjectId("65425d48c4e989fdee53019b")
//     }
//   ]
//   [
//     {
//       private_key: '0x3586d035566540cdcf03ccca49a2ef2f0f4ebe668183c84db9514d95acf1aa8d',
//       address: '0xDc1b6e26427A1716E287Eb31Ea2D4cF3B4aD5c38',
//       balance: 0,
//       others: [],
//       _id: new ObjectId("65456b28599dfc46062f0621")
//     }
//   ]
//   [
//     {
//       private_key: '0x0f0720b36e91ece0b8255ab407943f2b041a26231fd18dac9ca14444a7788ece',
//       address: '0x63123A3a3F1B3c0adEbf7a534f6B7FC169790Ae9',
//       balance: 0,
//       others: [],
//       _id: new ObjectId("654735992ba027cb7e3eda94")
//     }
//   ]
//   [
//     {
//       private_key: '0xc22d2b5d5a903ce6928088853cf160c36bf6175679a8ac6009d304c54d27d793',
//       address: '0xcdbCec971339a1Cb34003BA25b384b4d95dFd74e',
//       balance: 0,
//       others: [],
//       _id: new ObjectId("6548a77a490877bf9084829f")
//     }
//   ]
//   [
//     {
//       private_key: '0x66cb413ca22d06de15b85186749fcc3b7fe334c0600fc5d1b6395d494a703aa7',
//       address: '0xF0b2ccBd54cAE2927834Bf107569f483B2dEF61f',
//       balance: 0,
//       others: [],
//       _id: new ObjectId("65555946f1141cd0ad2dd1bb")
//     }
//   ]
//   [
//     {
//       private_key: '0xb28947a4775be2ed7b5f719478035f82a37db4c8ed9ea7846955af206cf99351',
//       address: '0xE76c31Cb770415c010f3A0FC3ECE81B515badd88',
//       others: [],
//       _id: new ObjectId("6559cd46a3773dab64866ef4")
//     }
//   ]
//   [
//     {
//       private_key: '0x8335093339cad343406230fcb64ef4c188cab60f860d4f7ad8be63c7032ad2a6',
//       address: '0x21af77dC85B29C065840C59F63B958bF7555e63B',
//       others: [],
//       _id: new ObjectId("65623ab00d41ed4c47a79a0f")
//     }
//   ]
//   [
//     {
//       private_key: '0x31599b810176f7b138bc7b21d36f700992f59174721ddf5c9010ff41292883d6',
//       address: '0xa24FF32d1De12Ad430D14dFd9B883a011ad04fC8',
//       others: [],
//       _id: new ObjectId("6563acfac22c8ad1af97e4d7")
//     }
//   ]