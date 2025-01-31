import React, { useEffect, useState } from "react";
import './index.css';
import { CgRemoveR } from "react-icons/cg";

import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Card, Col } from 'antd';

import { initializeApp } from "firebase/app";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore
} from "firebase/firestore";

const firebaseConfig = initializeApp({
    apiKey: "AIzaSyDOdBGMIqiHyxPuNzd6l5QHia4pK4zZ_K0",
    authDomain: "teste2-34a4d.firebaseapp.com",
    projectId: "teste2-34a4d",
});

export const App = () => {
    const { Header, Content, Footer, Sider } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [users, setUsers] = useState([])

    const db = getFirestore(firebaseConfig)
    const userCollectionRef = collection(db, "user")

    const [User, setUser] = React.useState(false);

    async function createUsers() {
        console.log({ name, email })
        if (name !== "" && email !== "") {
            const user = await addDoc(userCollectionRef, {
                name,
                email,
            })
            console.log("teste", user)
        } else {
            alert("Um dos campos esta vazio")
        }
    }

    const items = [
        {
            key: 'sub1',
            icon: <UserOutlined />,
            label: 'Users',
            children: users.map(user => ({
                key: user.email,
                label: user.name,
                onClick: () => setUser(user)
            }))
        }
    ];

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(userCollectionRef)
            console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

            // Itera sobre os documentos retornados (data.docs).
            // Para cada documento (doc), extrai seus dados (doc.data()) e adiciona o ID do documento (doc.id).
            // Cria um novo array de objetos que contém os dados e o ID.
            // Imprime esse novo array no console.
            setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getUsers()
    })

    async function deleteUser(id) {
        const userDoc = doc(db, "user", id)
        await deleteDoc(userDoc)
    }

    return (
        <div className="App">
            <Layout
                style={{
                    minHeight: '100vh',
                }}
            >
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="demo-logo-vertical" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
                </Sider>
                <Layout>
                    <Header className="header"
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                        }}
                    >
                        <div className="inputs">
                            <input
                                required
                                type="text"
                                placeholder="Name..."
                                value={name}
                                onChange={e => setName(e.target.value)} />
                            <input
                                type="text"
                                placeholder="Email..."
                                value={email}
                                onChange={e => setEmail(e.target.value)} />
                            <div>
                                <button onClick={createUsers}>Create User</button>
                            </div>
                        </div>
                    </Header>
                    <Content className="bg">
                        {User && (
                            <Col span={6}>
                                <Card className="font-size" title={User.name} bordered={false}>
                                    <span>Email: {User.email}</span><br />
                                    <button className="deleteUser" onClick={() => deleteUser(User.id)}>Delete User<CgRemoveR />                        </button>
                                </Card>
                            </Col>
                        )}
                    </Content>
                    <Footer className="footer"
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        <h3>WELINGHTON</h3>
                    </Footer>
                </Layout>
            </Layout>

        </div>
    );
}

