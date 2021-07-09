import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export const Home = () => {
    return (
        <nav>
            <ul className="list">
                <li>
                    <Link className="link" to="/newUser">
                        Новый клиент
                    </Link>
                </li>
                <li>
                    <Link className="link" to="/regCup">
                        Зарегистрировать кружку (или пару)
                    </Link>
                </li>
                <li>
                    <Link className="link" to="/changeUser">
                        Изменить данные клиента
                    </Link>
                </li>
                <li>
                    <Link className="link" to="/removeCups">
                        Снести ошибки прошлого
                    </Link>
                </li>
                <li>
                    <Link className="link" to="/deleteUser">
                        Удалить пользователя
                    </Link>
                </li>
            </ul>
        </nav>
    );
};
