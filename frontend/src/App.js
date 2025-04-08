import './App.css';
import { Component } from "react";

class App extends Component {
  state = {
    users: [],
    formData: {
      name: '',
      age: ''
    }
  };

  async componentDidMount() {
    console.log('API请求触发');
    const response = await fetch('/user/list');
    const body = await response.json();
    this.setState({ users: body.data });
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, age } = this.state.formData;

    try {
      const response = await fetch('/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          age: Number(age) // 确保年龄是数字类型
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('添加用户成功:', result);

      // 清空表单
      this.setState({
        formData: {
          name: '',
          age: ''
        }
      });

      // 可选：刷新用户列表
      const listResponse = await fetch('/user/list');
      const updatedList = await listResponse.json();
      this.setState({ users: updatedList.data });

    } catch (error) {
      console.error('添加用户失败:', error);
      // 这里可以添加错误处理逻辑，比如显示错误提示
    }
  };

  render() {
    const { users, formData } = this.state;

    return (
        <div>
          {/* 用户列表展示 */}
          <h2>用户列表</h2>
          {users.map(user =>
              <div key={user.id}>
                <p>{user.name} {user.age}</p>
              </div>
          )}

          {/* 添加用户表单 */}
          <div style={{ marginTop: '20px' }}>
            <h2>添加新用户</h2>
            <form onSubmit={this.handleSubmit}>
              <div>
                <label>
                  姓名:
                  <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={this.handleInputChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  年龄:
                  <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={this.handleInputChange}
                  />
                </label>
              </div>
              <button type="submit">提交</button>
            </form>
          </div>
        </div>
    );
  }
}

export default App;