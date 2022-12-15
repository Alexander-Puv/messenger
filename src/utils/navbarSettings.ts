import { PopupProps } from "../components/UI/Popup"

interface PopupOnclickProps {
  setPopup: (props: null | PopupProps) => void
}

interface ISetting {
  title: string,
  onClick: (props: PopupOnclickProps) => void
}

const text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium ratione iure reprehenderit at itaque aliquam fugiat labore maxime eligendi enim impedit veniam, neque repudiandae architecto! Obcaecati itaque quas architecto odit.'

export const settings: ISetting[] = [
  {
    title: 'Profile',
    onClick: ({setPopup}) => {
      setPopup({title: 'Profile', text, btnText: 'OK'})
    }
  },
  {
    title: 'Settings',
    onClick: ({setPopup}) => {
      setPopup({title: 'Settings', text, btnText: 'OK'})
    }
  },
  {
    title: 'FAQ',
    onClick: ({setPopup}) => {
      setPopup({title: 'FAQ', text, btnText: 'OK'})
    }
  },
  {
    title: 'Logout',
    onClick: ({setPopup}) => {
      setPopup({title: 'Logout', text, btnText: 'Cancel'})
    }
  }
]