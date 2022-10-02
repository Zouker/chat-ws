import React, {ChangeEvent, KeyboardEvent, useEffect, useState} from 'react';
import './App.css';

type Message = {
    userId: string
    userName: string
    message: string
    photo: string
}

const detectUrls = (message: string) => {
    const expression = /(https:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)?)/gi;

    return message.replace(expression, `<a target="_blank" href="$1">$1</a>`)
}

function App() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const socket = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx');
        setSocket(socket);

        socket.onmessage = (event: MessageEvent) => {
            const messagesFromServer = JSON.parse(event.data);
            //setMessages([...messagesFromServer.reverse(), ...messages])
            setMessages((actualMessages) => [...messagesFromServer.reverse(), ...actualMessages]);
        }
    }, [])

    const send = () => {
        socket!.send(message)
        setMessage('')
    }

    const onMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.currentTarget.value)
    }

    const onKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey && e.key === 'Enter') {
            send()
        }
    }

    return (
        <div className="App">
            <div className="messageBlock">
            <textarea value={message}
                      onKeyUp={onKeyPress}
                      onChange={onMessageChange}>

            </textarea>
                <button onClick={send}>Send</button>
            </div>
            <div className="chatBlock">
                {messages.map((m, index) => {
                    return <div key={index}>
                        <b>{m.userName}:</b> <span
                        dangerouslySetInnerHTML={{__html: detectUrls(m.message)}}></span>
                    </div>
                })}
            </div>
        </div>
    );
}

export default App;
