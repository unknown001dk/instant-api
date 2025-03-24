import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Select,
  Table,
  Modal,
  Form,
  notification,
  Row,
  Col,
} from "antd";
import "./SchemaEditer.css";
import {
  NotificationError,
  NotificationSucess,
} from "../../utils/Notification";
import { IsUserLoggedIn } from "../../utils/CheckUser";

const { Option } = Select;

const SchemaEditor = () => {
  const [schemas, setSchemas] = useState([]);
  const [schemaName, setSchemaName] = useState("");
  const [fields, setFields] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fieldData, setFieldData] = useState({
    name: "",
    type: "",
    required: false,
    unique: false,
  });
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  // alert(userId)

  // Fetch token and userId on load
  useEffect(() => {
    IsUserLoggedIn();
    const tokenData = sessionStorage.getItem("token");
    const user = JSON.parse(tokenData);
    if (user) {
      setToken(user.token);
      setUserId(user.user?._id);
    }
  }, []);

  // Fetch schemas once token and userId are available
  useEffect(() => {
    if (token && userId) {
      fetchSchemas(userId);
    }
  }, [token, userId]);

  const fetchSchemas = async (userId) => {
    try {
      const schemaId = userId;
      const response = await axios.get(
        `http://localhost:8081/api/v1/schema/${schemaId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.status === 200) {
        setSchemas(response.data);
        NotificationSucess("Schemas Fetched", "Schemas fetched successfully.");
      }
    } catch (error) {
      NotificationError(
        "Fetch Error",
        error.response?.data?.message || "Failed to fetch schemas."
      );
    }
  };

  const handleAddField = () => {
    if (!fieldData.name || !fieldData.type) {
      NotificationError("Validation Error", "Field name and type are required.");
      return;
    }
    setFields([...fields, fieldData]);
    setFieldData({ name: "", type: "", required: false, unique: false });
    setModalVisible(false);
  };

  const handleSubmitSchema = async () => {
    if (!schemaName || fields.length === 0) {
      alert("failed")
      NotificationError(
        "Invalid Schema",
        "Please enter a schema name and add at least one field."
      );
      return;
    }

    const schema = {
      userId,
      name: schemaName,
      fields,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/api/v1/schema/create",
        schema,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        NotificationSucess(
          "Schema Created",
          `Schema "${schemaName}" created successfully.`
        );
        alert(`http://localhost:8081/api/v1/dynamic/${schemaName}/${userId}`)
        setSchemaName("");
        setFields([]);
        fetchSchemas(userId);
      }
    } catch (error) {
      NotificationError("Creation Error", "Failed to create schema.");
    }
  };

  const handleDeleteSchema = async (schemaId) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/schema/${schemaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      NotificationSucess("Deleted", "Schema deleted successfully.");
      fetchSchemas(userId);
    } catch (error) {
      NotificationError("Deletion Error", "Failed to delete schema.");
    }
  };

  const columns = [
    { title: "Schema Name", dataIndex: "name", key: "name" },
    {
      title: "Fields",
      key: "fields",
      render: (_, record) => {
        const fieldsArray =
          Array.isArray(record.schemaDefinition) && record.schemaDefinition[0]
            ? Object.entries(record.schemaDefinition[0]).map(
                ([key, config], index) => (
                  <div key={index}>
                    <strong>{key}:</strong> Type: {config.type}, Required:{" "}
                    {config.required ? "Yes" : "No"}, Unique:{" "}
                    {config.unique ? "Yes" : "No"}
                  </div>
                )
              )
            : "No fields available";
        return fieldsArray;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button
            onClick={() => console.log("Edit schema:", record._id)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button danger onClick={() => handleDeleteSchema(record._id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="schema-editor-container">
      <h1 style={{ textAlign: "center" }}>Schema Editor</h1>

      {/* Schema Name Input */}
      <Form layout="vertical">
        <Form.Item label="Schema Name">
          <Input
            placeholder="Enter schema name (e.g., User)"
            value={schemaName}
            onChange={(e) => setSchemaName(e.target.value)}
          />
        </Form.Item>
      </Form>

      {/* Add Field Button */}
      <Row gutter={16} justify="start" style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={12} md={8}>
          <Button type="primary" block onClick={() => setModalVisible(true)}>
            Add Field
          </Button>
        </Col>
      </Row>

      {/* Preview Fields Table */}
      <Table
        dataSource={fields.map((field, index) => ({ ...field, key: index }))}
        columns={[
          { title: "Field Name", dataIndex: "name", key: "name" },
          { title: "Type", dataIndex: "type", key: "type" },
          {
            title: "Required",
            dataIndex: "required",
            key: "required",
            render: (text) => (text ? "Yes" : "No"),
          },
          {
            title: "Unique",
            dataIndex: "unique",
            key: "unique",
            render: (text) => (text ? "Yes" : "No"),
          },
        ]}
        style={{ marginTop: "20px" }}
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      {/* Submit Schema Button */}
      <Row gutter={16} justify="center" style={{ marginTop: "20px" }}>
        <Col xs={24} sm={12} md={8}>
          <Button type="primary" block onClick={handleSubmitSchema}>
            Submit Schema
          </Button>
        </Col>
      </Row>

      {/* Modal for Adding Field */}
      <Modal
        title="Add Field"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAddField}
      >
        <Form layout="vertical">
          <Form.Item label="Field Name">
            <Input
              placeholder="Enter field name (e.g., username)"
              value={fieldData.name}
              onChange={(e) =>
                setFieldData({ ...fieldData, name: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Type">
            <Select
              placeholder="Select data type"
              value={fieldData.type}
              onChange={(value) => setFieldData({ ...fieldData, type: value })}
            >
              <Option value="String">String</Option>
              <Option value="Number">Number</Option>
              <Option value="Boolean">Boolean</Option>
              <Option value="Date">Date</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Required">
            <Select
              value={fieldData.required}
              onChange={(value) =>
                setFieldData({ ...fieldData, required: value })
              }
            >
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Unique">
            <Select
              value={fieldData.unique}
              onChange={(value) =>
                setFieldData({ ...fieldData, unique: value })
              }
            >
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Display Saved Schemas */}
      <Table
        dataSource={
          Array.isArray(schemas)
            ? schemas.map((schema) => ({ ...schema, key: schema._id }))
            : []
        }
        columns={columns}
        style={{ marginTop: "40px" }}
        pagination={false}
      />
    </div>
  );
};

export default SchemaEditor;
