'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { pedidoSchema } from './schemas'

export async function criarPedido(
  nome: string,
  endereco: string,
  telefone: string,
  produtos: Array<{ produtoId: string; quantidade: number }>
) {
  try {
    // Validar dados com Zod
    const validacao = pedidoSchema.safeParse({
      nome,
      endereco,
      telefone,
    })

    if (!validacao.success) {
      return {
        error: validacao.error.issues[0]?.message || 'Erro na validação dos dados',
      }
    }

    if (!produtos || produtos.length === 0) {
      return { error: 'Selecione pelo menos um produto' }
    }

    // Criar pedido com produtos
    const pedido = await prisma.pedido.create({
      data: {
        nome: validacao.data.nome,
        endereco: validacao.data.endereco,
        telefone: validacao.data.telefone,
        produtos: {
          create: produtos.map((p) => ({
            produtoId: p.produtoId,
            quantidade: p.quantidade,
          })),
        },
      },
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true, pedido }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return { error: 'Erro ao criar pedido' }
  }
}

export async function editarPedido(
  id: string,
  nome: string,
  endereco: string,
  telefone: string,
  produtos: Array<{ produtoId: string; quantidade: number }>
) {
  try {
    // Validar dados com Zod
    const validacao = pedidoSchema.safeParse({
      nome,
      endereco,
      telefone,
    })

    if (!validacao.success) {
      return {
        error: validacao.error.issues[0]?.message || 'Erro na validação dos dados',
      }
    }

    if (!produtos || produtos.length === 0) {
      return { error: 'Selecione pelo menos um produto' }
    }

    // Deletar produtos antigos
    await prisma.produtoPedido.deleteMany({
      where: { pedidoId: id },
    })

    // Atualizar pedido e criar novos produtos
    const pedido = await prisma.pedido.update({
      where: { id },
      data: {
        nome: validacao.data.nome,
        endereco: validacao.data.endereco,
        telefone: validacao.data.telefone,
        produtos: {
          create: produtos.map((p) => ({
            produtoId: p.produtoId,
            quantidade: p.quantidade,
          })),
        },
      },
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true, pedido }
  } catch (error) {
    console.error('Erro ao editar pedido:', error)
    return { error: 'Erro ao editar pedido' }
  }
}

export async function excluirPedido(id: string) {
  try {
    await prisma.pedido.delete({
      where: { id },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir pedido:', error)
    return { error: 'Erro ao excluir pedido' }
  }
}
