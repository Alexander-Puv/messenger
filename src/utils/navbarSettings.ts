import { Auth } from "firebase/auth"

interface SettingOnClickProps {
  auth: Auth
}

interface ISetting {
  title: string,
  onClick: (props: any) => void
}

export const settings: ISetting[] = [
  {title: 'Profile', onClick: () => {}},
  {title: 'Settings', onClick: () => {}},
  {title: 'FAQ', onClick: () => {}},
  {title: 'Logout', onClick: ({auth}: SettingOnClickProps) => {auth.signOut()}}
]