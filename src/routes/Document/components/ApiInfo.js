/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Typography, Table } from "antd";
import React, { useContext } from "react";
import ApiDebug from "./ApiDebug";
import ApiContext from "./ApiContext";
import { getIntlContent } from "../../../utils/IntlUtils";

const { Title, Text, Paragraph } = Typography;

function ApiInfo() {
  const {
    apiData: { envProps = [] },
    apiDetail: {
      summary,
      name: apiName,
      description,
      requestParameters,
      responseParameters
    }
  } = useContext(ApiContext);

  const columns = [
    {
      title: getIntlContent("SHENYU.PLUGIN.SELECTOR.LIST.COLUMN.NAME"),
      dataIndex: "name"
    },
    {
      title: getIntlContent("SHENYU.COMMON.TYPE"),
      dataIndex: "type"
    },
    {
      title: getIntlContent("SHENYU.COMMON.REQUIRED"),
      dataIndex: "required",
      render: v =>
        v ? (
          <Text type="danger">{getIntlContent("SHENYU.COMMON.YES")}</Text>
        ) : (
          getIntlContent("SHENYU.COMMON.NO")
        )
    },
    {
      title: getIntlContent("SHENYU.COMMON.MAX.LENGTH"),
      dataIndex: "maxLength"
    },
    {
      title: getIntlContent("SHENYU.PLUGIN.DESCRIBE"),
      dataIndex: "description"
    },
    {
      title: getIntlContent("SHENYU.COMMON.MAX.EXAMPLE"),
      dataIndex: "example"
    }
  ];

  const defaultCommonData = [
    {
      id: 1,
      name: "code",
      type: "integer",
      description: "返回码",
      example: "200"
    },
    {
      id: 2,
      name: "message",
      type: "string",
      description: "错误描述信息",
      example: "非法的参数"
    },
    {
      id: 3,
      name: "data",
      type: "object",
      description: "响应的业务结果",
      example: '{"id":"1988771289091030"}'
    }
  ];

  const envPropsColumns = [
    {
      title: getIntlContent("SHENYU.COMMON.MAX.ENVIRONMENT"),
      dataIndex: "envLabel"
    },
    {
      title: getIntlContent("SHENYU.COMMON.TYPE"),
      dataIndex: "addressLabel"
    },
    {
      title: getIntlContent("SHENYU.DOCUMENT.APIDOC.INFO.ADDRESS"),
      dataIndex: "addressUrl"
    }
  ];

  return (
    <>
      <Title level={2}>{summary}</Title>
      <Title level={4}>
        {getIntlContent("SHENYU.DOCUMENT.APIDOC.INFO.NAME")}
      </Title>
      <Text code>{apiName}</Text>
      <Title level={4}>
        {getIntlContent("SHENYU.DOCUMENT.APIDOC.INFO.DESCRIPTION")}
      </Title>
      <Text type="secondary">{description}</Text>
      <Title level={4}>
        {getIntlContent("SHENYU.DOCUMENT.APIDOC.INFO.ADDRESS")}
      </Title>
      <Paragraph>
        <Table
          size="small"
          rowKey="envLabel"
          bordered
          dataSource={envProps}
          pagination={false}
          columns={envPropsColumns}
        />
      </Paragraph>

      <Title level={2}>
        {getIntlContent("SHENYU.DOCUMENT.APIDOC.INFO.REQUEST.PARAMETERS")}
      </Title>
      <Title level={4}>
        {getIntlContent(
          "SHENYU.DOCUMENT.APIDOC.INFO.SERVICE.REQUEST.PARAMETERS"
        )}
      </Title>
      <Paragraph>
        <Table
          size="small"
          rowKey="id"
          bordered
          dataSource={requestParameters}
          pagination={false}
          childrenColumnName="refs"
          columns={columns}
        />
      </Paragraph>

      <Title level={2}>
        {getIntlContent("SHENYU.DOCUMENT.APIDOC.INFO.RESPONSE.PARAMETERS")}
      </Title>
      <Title level={4}>
        {getIntlContent(
          "SHENYU.DOCUMENT.APIDOC.INFO.COMMON.RESPONSE.PARAMETERS"
        )}
      </Title>
      <Paragraph>
        <Table
          size="small"
          rowKey="id"
          bordered
          dataSource={defaultCommonData}
          pagination={false}
          columns={columns.filter((_, i) => ![2, 3].includes(i))}
        />
      </Paragraph>
      <Title level={4}>
        {getIntlContent(
          "SHENYU.DOCUMENT.APIDOC.INFO.BUSINESS.RESPONSE.PARAMETERS"
        )}
      </Title>
      <Paragraph>
        <Table
          size="small"
          rowKey="id"
          bordered
          dataSource={responseParameters}
          pagination={false}
          childrenColumnName="refs"
          columns={columns}
        />
      </Paragraph>

      <Title level={2}>
        {getIntlContent("SHENYU.DOCUMENT.APIDOC.INFO.INTERFACE.DEBUG")}
      </Title>
      <ApiDebug />
    </>
  );
}

export default ApiInfo;
