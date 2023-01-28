import { PopupProps } from "../components/UI/Popup/Popup"
import ProfileContent from "../components/UI/Popup/components/Profile"
import SettingsContent from "../components/UI/Popup/components/SettingsContent"
import { greenColor, redColor } from "./colors"

interface PopupOnclickProps {
  setPopup: (props: null | PopupProps) => void,
}

interface ISetting {
  title: string,
  onClick: (props: PopupOnclickProps) => void
}


// important titles
export const LOGOUT = 'Logout'
export const SETTINGS = 'Settings'
export const PROFILE = 'Profile'


const FAQContent = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium ratione iure reprehenderit at itaque aliquam fugiat labore maxime eligendi enim impedit veniam, neque repudiandae architecto! Obcaecati itaque quas architecto odit.'
const logoutContent = "No! Don't leave me! I can offer you somthing... Yes, yes... Just don't click anywhere and you will unlock it in 25 hours!"

// too rude
// "Wanna logout? And what are you gonna do without it? You're gonna go out and breathe fresh air? Don't spread nonsense! Order some pizza, close the windows, turn off the lights and look at the monitor"


export const settings: ISetting[] = [
  {
    title: PROFILE,
    onClick: ({setPopup}) => {
      setPopup({title: PROFILE, content: <ProfileContent />, btnText: 'OK'})
    }
  },
  {
    title: SETTINGS,
    onClick: ({setPopup}) => {
      setPopup({
        title: SETTINGS, content: <SettingsContent />, btnText: 'OK',
        secondBtnProps: {sx: {color: greenColor}, children: 'Apply'}
      })
    }
  },
  {
    title: 'FAQ',
    onClick: ({setPopup}) => {
      setPopup({title: 'FAQ', content: FAQContent, btnText: 'OK'})
    }
  },
  {
    title: LOGOUT,
    onClick: ({setPopup}) => {
      setPopup({
        title: LOGOUT, content: logoutContent, btnText: 'Cancel',
        secondBtnProps: {
          sx: {color: redColor},
          children: LOGOUT
        }
      })
    }
  }
]