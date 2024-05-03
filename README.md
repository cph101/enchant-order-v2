<h1><img src="https://github.com/cph101/enchant-order-v2/blob/main/.github/images/rich_title.png" height="40px" /></h1>

![Made with react](https://img.shields.io/badge/Made%20with-React-%2338BDF8?logo=react&logoColor=%2338BDF8)
![Build status](https://img.shields.io/github/actions/workflow/status/cph101/enchant-order-v2/publish.yml?logo=tailwindcss&logoColor=%2338BDF8&label=Build&color=%2338BDF8)
![Deploy status](https://img.shields.io/github/deployments/cph101/enchant-order-v2/github-pages?logo=googlechrome&logoColor=%2338BDF8&label=Deploy&color=%2338BDF8)

> [!CAUTION]
> This project is incomplete and not yet in a functional state.<br>
> Please use the original version while we work to complete the former.

**Based on [iamcal/enchant-order](https://github.com/iamcal/enchant-order)**

This web-based tool allows you to find the optimal order for combining enchant books in Minecraft to minimize XP cost.

You can use it here: https://cph101.github.io/enchant-order-v2/

## How it works

#### Calculating
This tool tries every possible combining sequence and calculating the cost of each. For items with many enchantments, this can mean trying a few million combinations. The work happens in a background thread (a WebWorker) and the best solution is explained.

#### Deploying
Upon a push event to the git repository, tailwind css & daisyui are compiled into `src/tailwind.css`. After this step `npm run build` is run and the output files are transferred to the [gh-pages](https://github.com/cph101/enchant-order-v2/tree/gh-pages) branch. Once this has been done, the files are deployed using the standard github pages script.
