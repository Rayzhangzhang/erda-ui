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

import { apiCreator } from 'core/service';

interface ServicesParams {
  tenantId: string;
  serviceName?: string;
  pageNo: number;
  pageSize: number;
}

interface AnalyzerOverviewParams {
  tenantId: string;
  serviceIds: string[];
}

interface View {
  timestamp: number;
  value: number;
}

interface Views {
  type: string;
  data: number;
  view: View[];
}

interface List {
  id: string;
  language: string;
  lastHeartbeat: string;
  name: string;
  views?: Views[];
}

interface ServicesData {
  list: List[];
  total: number;
  pageNo: number;
  pageSize: number;
}

interface AnalyzerData {
  views: Views[];
  serviceId: string;
}

interface AnalyzerOverviewData {
  list: AnalyzerData[];
}

const apis = {
  getServices: {
    api: 'get@/api/msp/apm/services',
  },
  getAnalyzerOverview: {
    api: 'get@/api/msp/apm/service/analyzer-overview',
  },
};

export const getServices = apiCreator<(payload: ServicesParams) => ServicesData>(apis.getServices);
export const getAnalyzerOverview = apiCreator<(payload: AnalyzerOverviewParams) => AnalyzerOverviewData>(
  apis.getAnalyzerOverview,
);