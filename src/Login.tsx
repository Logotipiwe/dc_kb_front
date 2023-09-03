import React from 'react';
import {Button, FormLayout, FormStatus, Input, Link, Root, View} from "@vkontakte/vkui/dist";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import {inject, observer} from "mobx-react/dist";
import RootStore from './stores/RootStore';

@inject("RootStore")
@observer
class Login extends React.Component<{RootStore?: RootStore},{}>{

	render() {
		const {loginUI} = this.props.RootStore!.uiStore;

		return (
			<Root activeView={loginUI.activeView}>
				<View id='login' activePanel='1' header={false}>
					<Panel id='1'>
						<FormLayout>
							<Input top={'Логин'}
							       value={loginUI.inputLogin}
							       onChange={loginUI.setInputLogin}
							/>
							<Input top={'Пароль'}
								   type="password"
							       value={loginUI.inputPassword}
							       onChange={loginUI.setInputPassword}
							/>
							<Button size="xl" mode="primary" onClick={loginUI.submitLogin}>Войти</Button>
							<Div style={{textAlign: 'center'}}>
								Ещё не зарегистрированы? <Link onClick={loginUI.setActiveView.bind(null,'reg')}>Вам сюда</Link>
							</Div>
						</FormLayout>
					</Panel>
				</View>
				<View id='reg' activePanel='1' header={false}>
					<Panel id='1'>
						<FormLayout>
							<Input top={'Логин'} value={loginUI.inputLoginReg}
							       onChange={loginUI.setInputLoginReg}/>
							<Input top={'Пароль'} value={loginUI.inputPasswordReg} type="password"
								   onChange={loginUI.setInputPasswordReg}
							/>
							<Button size="xl" mode="primary" onClick={loginUI.submitReg}>Зарегистрироваться</Button>
							<FormStatus mode={"error"}>
								<p style={{fontSize: 16, margin: 0}}>Пользователь с таким логином уже зарегистирован</p>
							</FormStatus>
							<Div style={{textAlign: 'center'}}>
								Уже зарегистрированы? <Link onClick={loginUI.setActiveView.bind(null,'login')}>Вам сюда</Link>
							</Div>
						</FormLayout>
					</Panel>
				</View>
			</Root>
		);
	}
}
export default Login
