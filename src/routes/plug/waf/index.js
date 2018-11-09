import React, { Component } from "react";
import { Table, Row, Col, Button, message } from "antd";
import { connect } from "dva";
import Selector from "./Selector";
import Rule from "./Rule";

@connect(({ waf, global, loading }) => ({
  ...global,
  ...waf,
  loading: loading.effects["global/fetchPlatform"]
}))
export default class Waf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectorPage: 1,
      rulePage: 1,
      popup: ""
    };
  }

  componentDidMount() {
    this.getAllSelectors(1);
  }

  getAllSelectors = page => {
    const { dispatch } = this.props;
    dispatch({
      type: "waf/fetchSelector",
      payload: {
        currentPage: page,
        pageSize: 12
      }
    });
  };

  getAllRules = page => {
    const { dispatch, currentSelector } = this.props;
    const selectorId = currentSelector ? currentSelector.id : "";
    dispatch({
      type: "waf/fetchRule",
      payload: {
        selectorId,
        currentPage: page,
        pageSize: 12
      }
    });
  };

  getPluginId = name => {
    const { plugins } = this.props;
    const plugin = plugins.filter(item => {
      return item.name === name;
    });
    if (plugin && plugin.length > 0) {
      return plugin[0].id;
    } else {
      return "";
    }
  };

  closeModal = () => {
    this.setState({ popup: "" });
  };

  addSelector = () => {
    const { selectorPage } = this.state;
    const { dispatch } = this.props;
    const pluginId = this.getPluginId("waf");
    this.setState({
      popup: (
        <Selector
          pluginId={pluginId}
          handleOk={selector => {
            dispatch({
              type: "waf/addSelector",
              payload: { pluginId, ...selector },
              fetchValue: { pluginId, currentPage: selectorPage, pageSize: 12 },
              callback: () => {
                this.closeModal();
              }
            });
          }}
          onCancel={this.closeModal}
        />
      )
    });
  };

  addRule = () => {
    const { rulePage } = this.state;
    const { dispatch, currentSelector } = this.props;
    if (currentSelector && currentSelector.id) {
      const selectorId = currentSelector.id;
      this.setState({
        popup: (
          <Rule
            handleOk={rule => {
              dispatch({
                type: "waf/addRule",
                payload: { selectorId, ...rule },
                fetchValue: {
                  selectorId,
                  currentPage: rulePage,
                  pageSize: 12
                },
                callback: () => {
                  this.closeModal();
                }
              });
            }}
            onCancel={this.closeModal}
          />
        )
      });
    } else {
      message.destroy();
      message.warn("请先添加选择器");
    }
  };

  editSelector = record => {
    const { dispatch } = this.props;
    const { selectorPage } = this.state;
    const pluginId = this.getPluginId("waf");
    const { id } = record;
    dispatch({
      type: "waf/fetchSeItem",
      payload: {
        id
      },
      callback: selector => {
        this.setState({
          popup: (
            <Selector
              {...selector}
              handleOk={values => {
                dispatch({
                  type: "waf/updateSelector",
                  payload: {
                    pluginId,
                    ...values,
                    id
                  },
                  fetchValue: {
                    pluginId,
                    currentPage: selectorPage,
                    pageSize: 12
                  },
                  callback: () => {
                    this.closeModal();
                  }
                });
              }}
              onCancel={this.closeModal}
            />
          )
        });
      }
    });
  };

  deleteSelector = record => {
    const { dispatch } = this.props;
    const { selectorPage } = this.state;
    const pluginId = this.getPluginId("waf");
    dispatch({
      type: "waf/deleteSelector",
      payload: {
        list: [record.id]
      },
      fetchValue: {
        pluginId,
        currentPage: selectorPage,
        pageSize: 12
      }
    });
  };

  pageSelectorChange = page => {
    this.setSate({ selectorPage: page });
    this.getAllSelectors(page);
  };

  pageRuleChange = page => {
    this.setState({ rulePage: page });
    this.getAllRules(page);
  };

  // 点击选择器
  rowClick = record => {
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type: "waf/saveCurrentSelector",
      payload: {
        currentSelector: record
      }
    });
    dispatch({
      type: "waf/fetchRule",
      payload: {
        currentPage: 1,
        pageSize: 12,
        selectorId: id
      }
    });
  };

  editRule = record => {
    const { dispatch, currentSelector } = this.props;
    const { rulePage } = this.state;
    const selectorId = currentSelector ? currentSelector.id : "";
    const { id } = record;
    dispatch({
      type: "waf/fetchRuleItem",
      payload: {
        id
      },
      callback: rule => {
        this.setState({
          popup: (
            <Rule
              {...rule}
              handleOk={values => {
                dispatch({
                  type: "waf/updateRule",
                  payload: {
                    selectorId,
                    ...values,
                    id
                  },
                  fetchValue: {
                    selectorId,
                    currentPage: rulePage,
                    pageSize: 12
                  },
                  callback: () => {
                    this.closeModal();
                  }
                });
              }}
              onCancel={this.closeModal}
            />
          )
        });
      }
    });
  };

  deleteRule = record => {
    const { dispatch, currentSelector } = this.props;
    const { rulePage } = this.state;
    dispatch({
      type: "waf/deleteRule",
      payload: {
        list: [record.id]
      },
      fetchValue: {
        selectorId: currentSelector.id,
        currentPage: rulePage,
        pageSize: 12
      }
    });
  };

  asyncClick = () => {
    const { dispatch } = this.props;
    const id = this.getPluginId("waf");
    dispatch({
      type: "global/asyncPlugin",
      payload: {
        id
      }
    });
  };

  render() {
    const { popup, selectorPage, rulePage } = this.state;
    const {
      selectorList,
      ruleList,
      selectorTotal,
      ruleTotal,
      currentSelector
    } = this.props;
    const selectColumns = [
      {
        align: "center",
        title: "名称",
        dataIndex: "name",
        key: "name"
      },
      {
        align: "center",
        title: "开启",
        dataIndex: "enabled",
        key: "enabled",
        render: text => {
          if (text) {
            return <div className="open">开启</div>;
          } else {
            return <div className="close">关闭</div>;
          }
        }
      },
      {
        align: "center",
        title: "操作",
        dataIndex: "operate",
        key: "operate",
        render: (text, record) => {
          return (
            <div>
              <span
                style={{ marginRight: 8 }}
                className="edit"
                onClick={e => {
                  e.stopPropagation();
                  this.editSelector(record);
                }}
              >
                修改
              </span>
              <span
                className="edit"
                onClick={e => {
                  e.stopPropagation();
                  this.deleteSelector(record);
                }}
              >
                删除
              </span>
            </div>
          );
        }
      }
    ];

    const rulesColumns = [
      {
        align: "center",
        title: "规则名称",
        dataIndex: "name",
        key: "name"
      },
      {
        align: "center",
        title: "开启",
        dataIndex: "enabled",
        key: "enabled",
        render: text => {
          if (text) {
            return <div className="open">开启</div>;
          } else {
            return <div className="close">关闭</div>;
          }
        }
      },
      {
        align: "center",
        title: "更新时间",
        dataIndex: "dateCreated",
        key: "dateCreated"
      },
      {
        align: "center",
        title: "操作",
        dataIndex: "operate",
        key: "operate",
        render: (text, record) => {
          return (
            <div>
              <span
                className="edit"
                style={{ marginRight: 8 }}
                onClick={e => {
                  e.stopPropagation();
                  this.editRule(record);
                }}
              >
                修改
              </span>
              <span
                className="edit"
                onClick={e => {
                  e.stopPropagation();
                  this.deleteRule(record);
                }}
              >
                删除
              </span>
            </div>
          );
        }
      }
    ];

    return (
      <div className="plug-content-wrap">
        <Row gutter={20}>
          <Col span={8}>
            <div className="table-header">
              <h3>选择器列表</h3>
              <Button type="primary" onClick={this.addSelector}>
                添加选择器
              </Button>
            </div>
            <Table
              size="small"
              onRow={record => {
                return {
                  onClick: () => {
                    this.rowClick(record);
                  }
                };
              }}
              style={{ marginTop: 30 }}
              bordered
              columns={selectColumns}
              dataSource={selectorList}
              pagination={{
                total: selectorTotal,
                current: selectorPage,
                pageSize: 12,
                onChange: this.pageSelectorChange
              }}
              rowClassName={item => {
                if (currentSelector && currentSelector.id === item.id) {
                  return "table-selected";
                } else {
                  return "";
                }
              }}
            />
          </Col>
          <Col span={16}>
            <div className="table-header">
              <div style={{ display: "flex" }}>
                <h3 style={{ marginRight: 30 }}>选择器规则列表</h3>
                <Button icon="reload" onClick={this.asyncClick} type="primary">
                  同步waf
                </Button>
              </div>

              <Button type="primary" onClick={this.addRule}>
                添加规则
              </Button>
            </div>
            <Table
              size="small"
              style={{ marginTop: 30 }}
              bordered
              columns={rulesColumns}
              expandedRowRender={record => <p>{record.handle}</p>}
              dataSource={ruleList}
              pagination={{
                total: ruleTotal,
                current: rulePage,
                pageSize: 12,
                onChange: this.pageRuleChange
              }}
            />
          </Col>
        </Row>
        {popup}
      </div>
    );
  }
}
