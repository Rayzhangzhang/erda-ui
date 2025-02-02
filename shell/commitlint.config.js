// Copyright (c) 2021 Terminus, Inc.
//
// This program is free software: you can use, redistribute, and/or modify
// it under the terms of the GNU Affero General Public License, version 3
// or later ("AGPL"), as published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

// const read = require('@commitlint/read');


module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'refactor',
      'docs', 'style', 'perf', 'test', 'chore', 'revert', 'WIP',
    ]],
    'type-case': [1, 'always', 'snake-case'],
    // 'body-empty': async () => {
    //   let bodyEmpty = [2, 'always'];
    //   await read({ edit: true }).then((message) => {
    //     const commitStr = message.toString();
    //     const type = commitStr.split(':')[0];
    //     if (prefixList.includes(type) && !type.endsWith(suffixTypeMap.skip)) {
    //       bodyEmpty = [2, 'never'];
    //     }
    //   });
    //   return bodyEmpty;
    // },
  },
};
