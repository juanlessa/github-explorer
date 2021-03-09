import React, { useState, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FiChevronRight } from "react-icons/fi";
import logoImg from "../../assets/logo.svg";
import { Title, Form, Error, Repositories } from "./styles";

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    //state of input
    const [newRepo, setNewRepo] = useState("");
    //state of input error
    const [inputError, setInputError] = useState("");
    //state of repositories
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storageRepositories = localStorage.getItem(
            "@GithubExplorer:repositories"
        );
        if (storageRepositories) {
            return JSON.parse(storageRepositories);
        } else {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(
            "@GithubExplorer:repositories",
            JSON.stringify(repositories)
        );
    }, [repositories]);

    //add new repository
    async function hendleAddRepository(
        event: FormEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();
        if (!newRepo) {
            setInputError("Digite o autor/nome do repositório.");
            return;
        }
        try {
            const response = await api.get(`repos/${newRepo}`);
            console.log(response.data);
            setInputError("");
            const repository = response.data;
            setRepositories([...repositories, repository]);
            setNewRepo("");
        } catch (err) {
            setInputError("Repositório não encontrado.");
        }
    }
    return (
        <>
            <img src={logoImg} alt="Github Explorer" />
            <Title>Explore repositórios no Github</Title>
            <Form hasError={!!inputError} onSubmit={hendleAddRepository}>
                <input
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    type="text"
                    placeholder="Digite o nome do repositório"
                />
                <button type="submit">Pesquisar</button>
            </Form>
            {inputError && <Error>{inputError}</Error>}
            <Repositories>
                {repositories.map((repository) => (
                    <Link
                        key={repository.full_name}
                        to={`repository/${repository.full_name}`}
                    >
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    );
};
export default Dashboard;
