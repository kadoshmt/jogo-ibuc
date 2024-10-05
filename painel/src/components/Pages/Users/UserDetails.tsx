import React from 'react';
import { User } from '@/types/user';
import Image from 'next/image';

type UserDetailsProps = {
  user: User;
};

const UserDetails: React.FC<UserDetailsProps> = ({

  user,
}) => {
  return (
      <div className="space-y-4">
         <div className="relative z-30 mx-auto h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
          <div className="relative drop-shadow-2 ">
            <Image alt={"profile"} loading="lazy" width={"160"} height={"160"} decoding="async" data-nimg="1" className="overflow-hidden rounded-full border-primary border-8" src={user.profile?.avatarUrl || "/images/default-avatar.png"} />
          </div>
        </div>
        {user.profile?.name && (
          <p>
            <strong>Nome:</strong> {user.profile?.name}
          </p>
        )}
        {user.email && (
          <p>
          <strong>E-mail:</strong> {user.email}
        </p>
        )}
        {user.profile?.username && (
          <p>
          <strong>Username:</strong> {user.profile?.username}
        </p>
        )}
        {user.role && (
          <p>
            <strong>Perfil:</strong> {user.role}
          </p>
        )}
        {user.profile?.genre && (
          <p>
          <strong>Sexo:</strong> {user.profile?.genre}
        </p>
        )}
        {user.profile?.birthDate && (
          <p>
          <strong>Data de Nascimento:</strong> {user.profile?.birthDate}
        </p>
        )}
        {user.profile?.city && (
          <p>
          <strong>Cidade:</strong> {user.profile?.city}
        </p>
        )}
        {user.profile?.region && (
          <p>
          <strong>Estado/Região:</strong> {user.profile?.region}
        </p>
        )}
        {user.profile?.country && (
          <p>
          <strong>País:</strong> {user.profile?.country}
        </p>
        )}
        {user.profile?.phone && (
          <p>
          <strong>WhatsApp:</strong> {user.profile?.phone}
        </p>
        )}
        {user.createdAt && (
          <p>
          <strong>Data de Cadastro:</strong> {new Date(user.createdAt).toLocaleString("pt-BR",  { dateStyle: 'short' })}
        </p>
        )}




        {/* Outros dados do usuário */}
      </div>
  );
};

export default UserDetails;
