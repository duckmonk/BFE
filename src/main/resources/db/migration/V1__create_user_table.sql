CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_type VARCHAR(20) COMMENT '用户类型',
    name VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    email VARCHAR(100) COMMENT '邮箱',
    status VARCHAR(20) DEFAULT 'active' COMMENT '状态',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 插入测试数据
INSERT INTO user (user_type, name, password, email, status) VALUES 
('admin', 'admin', '123456', 'admin@example.com', 'active'),
('user', 'zhang', '123456', 'zhang@example.com', 'active'); 