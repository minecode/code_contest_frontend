import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	Container,
	Avatar,
	UserInfo,
	Dashboard,
	DashboardIcon,
	LogoutButton,
	LogoutIcon,
	LoginButton,
	LoginIcon
} from './Navbar'
import auth from '../../services/auth'
import { Data } from '../Interface'
import Switch from 'react-switch'
import { shade } from 'polished'
import usePeristedState from '../../hooks/usePersistedState'
import { ReCaptcha } from 'react-recaptcha-v3'
import { useRouter } from 'next/router'

const Navbar: React.FC = () => {
	const dispatch = useDispatch()
	const data = useSelector((state: Data) => state.data)
	const auth_var = useSelector((state: Data) => state.data.auth)
	const authenticated = useSelector(
		(state: Data) => state.data.auth.authenticated
	)
	const [theme, setTheme] = usePeristedState('theme', 'dark')

	useEffect(() => {
		if (theme === 'light') {
			document.documentElement.classList.add('light')
			document.documentElement.classList.remove('dark')
		} else if (theme === 'dark') {
			document.documentElement.classList.remove('light')
			document.documentElement.classList.add('dark')
		}
	}, [])

	const verifyCallback = recaptchaToken => {
		// Here you will get the final recaptchaToken!!!
		// console.log(recaptchaToken, '<= your recaptcha token')
	}

	const logout = () => {
		const newData = { data: data }
		newData.data.auth.authenticated = false
		dispatch({ type: 'LOGOUT', data: newData })
		localStorage.setItem('auth', JSON.stringify(newData.data.auth))

		window.location.href = process.env.NEXT_PUBLIC_AWS_LOGOUT || 'null'
	}
	const router = useRouter()

	return (
		<Container>
			<ReCaptcha
				sitekey="6LewbMwZAAAAAAeKjMMbilsGbBNGC5IRrdrXe-v9"
				action="string"
				verifyCallback={verifyCallback}
			/>
			{authenticated ? (
				<div
					style={{
						display: 'flex',
						flex: 1,
						justifyContent: 'space-between'
					}}
				>
					<UserInfo>
						<span>Welcome, {auth_var.user.name}!</span>
						<Avatar src={auth_var.user.image} />
					</UserInfo>
					<div style={{ display: 'flex' }}>
						<Dashboard
							onClick={() => {
								location.pathname.includes('dashboard')
									? router.push('/')
									: router.push('/dashboard')
							}}
						>
							<span>
								{location.pathname.includes('dashboard')
									? 'Home'
									: 'Dashboard'}
							</span>
							<DashboardIcon />
						</Dashboard>
						<LogoutButton
							onClick={() => {
								logout()
							}}
						>
							<span>Logout</span> <LogoutIcon />
						</LogoutButton>
					</div>
				</div>
			) : (
				<div
					style={{
						display: 'flex',
						flex: 1,
						justifyContent: 'flex-end'
					}}
				>
					<LoginButton
						onClick={() => {
							window.location.href =
								process.env.NEXT_PUBLIC_AWS_LOGIN || 'null'
						}}
					>
						<span>Login</span> <LoginIcon />
					</LoginButton>
				</div>
			)}
			{theme ? (
				<Switch
					onChange={() => {
						document.documentElement.classList.toggle('light')
						document.documentElement.classList.toggle('dark')
						setTheme(theme === 'light' ? 'dark' : 'light')
					}}
					checked={theme === 'light'}
					checkedIcon={false}
					uncheckedIcon={false}
					height={10}
					width={40}
					handleDiameter={20}
					offColor={shade(0.15, '#36393f')}
					onColor={shade(0.15, '#e1e1e1')}
				/>
			) : (
				<></>
			)}
		</Container>
	)
}

export default Navbar
