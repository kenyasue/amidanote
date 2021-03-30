import {
  Table,
  Row,
  Col,
  Input,
  Button,
  Select,
  Modal,
  Switch,
  Form,
  message,
} from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";

import { UploadOutlined } from "@ant-design/icons";

interface User {
  key: string;
  name: string;
  address: string;
  age: number;
}

const columns: ColumnsType<User> = [
  {
    key: "name",
    dataIndex: "name",
    filters: [
      {
        text: "Joe",
        value: "Joe",
      },
      {
        text: "Jim",
        value: "Jim",
      },
      {
        text: "Submenu",
        value: "Submenu",
        children: [
          {
            text: "Green",
            value: "Green",
          },
          {
            text: "Black",
            value: "Black",
          },
        ],
      },
    ],
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value as string) === 0,
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend"],
  },
  {
    title: "Age",
    dataIndex: "age",
    defaultSortOrder: "descend",
    sorter: (a: any, b: any) => a.age - b.age,
  },
  {
    title: "Address",
    dataIndex: "address",
    filters: [
      {
        text: "London",
        value: "London",
      },
      {
        text: "New York",
        value: "New York",
      },
    ],
    filterMultiple: false,
    onFilter: (value: any, record: any) => record.address.indexOf(value) === 0,
    sorter: (a: any, b: any) => a.address.length - b.address.length,
    sortDirections: ["descend", "ascend"],
  },
];

const data: Array<User> = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
  },
];

function onChange(pagination: any, filters: any, sorter: any, extra: any) {
  console.log("params", pagination, filters, sorter, extra);
}

export default () => (
  <>
    <Row gutter={[16, 16]}>
      <Col span={24} style={{ textAlign: "right" }}>
        <Select defaultValue={1} style={{ textAlign: "left", width: "320px" }}>
          <Option value={1}>Show files belongs to the document</Option>
          <Option value={1}>Show files belongs to the project</Option>
        </Select>

        <Button
          type="primary"
          icon={<UploadOutlined />}
          style={{ width: 48, marginLeft: 6 }}
          size="middle"
          onClick={(e) => {}}
        />
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <Table columns={columns} dataSource={data} onChange={onChange} />
      </Col>
    </Row>
  </>
);
