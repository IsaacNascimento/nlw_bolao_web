import Head from "next/head";
import Image from "next/image";
import appPrevImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import userAvatarExpImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessesCount: number;
  userCount: number;
}

const tailWindStyles = {
  wrapperLayout:
    "max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28",
  tituloBolaoStyle: "mt-14 text-white text-5xl font-bold leading-tight",
  divAvatarSpan: "mt-10 flex items-center gap-2",
  inputBolao:
    "flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100",
  btnCriarBolao:
    "bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700",
};

const defaultFields = {
  bolaoInput: "",
};

const Home = (props: HomeProps) => {
  const [fields, setFields] = useState(defaultFields);
  const { bolaoInput } = fields;

  const handleChange = (event: { target: HTMLInputElement }) => {
    const { name, value } = event.target;
    setFields({ ...fields, [name]: value });
  };

  const createPool = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: bolaoInput,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert("Bolão criado com sucesso! O código foi copiado para a área de transferência!");
  
      setFields(defaultFields);

    } catch (error) {
      console.info(error);
      alert("Falha ao criar o Bolão, tente novamente!")
    };
  };

  return (
    <div className={tailWindStyles.wrapperLayout}>
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className={tailWindStyles.tituloBolaoStyle}>
          Crie seu próprio botão da copa e compartilhe entre amigos!
        </h1>

        <div className={tailWindStyles.divAvatarSpan}>
          <Image src={userAvatarExpImg} alt="" />
          <strong className="text-gray-100 text-lg">
            <span className="text-ignite-500">{props.userCount}</span> pessoas
            jã estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            name="bolaoInput"
            type="text"
            value={bolaoInput}
            onChange={handleChange}
            required
            placeholder="Qual nome do seu bolão?"
            className={tailWindStyles.inputBolao}
          />
          <button type="submit" className={tailWindStyles.btnCriarBolao}>
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span className="">Bolões Criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"></div>

          <div className="flex items-center gap-6">
            <div>
              <Image src={iconCheckImg} alt="" />
              <div>
                <span>+{props.guessesCount}</span>
                <span>
                  {" "}
                  {props.guessesCount > 1
                    ? "Palpites enviados"
                    : "Palpite enviado"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPrevImg}
        alt="Dois celulares exibindo uma prévia da aplicação do NLW"
      />
    </div>
  );
};

export const getServerSideProps = async () => {
  // const poolCount = await api.get('pools/count');

  const [poolCount, guessesCount, userCount] = await Promise.all([
    api.get("pools/count"),
    api.get("guesses/count"),
    api.get("users/count"),
  ]);

  return {
    props: {
      poolCount: poolCount.data.count,
      guessesCount: guessesCount.data.guessesQuantity,
      userCount: userCount.data.usersQuantity,
    },
  };
};

export default Home;
