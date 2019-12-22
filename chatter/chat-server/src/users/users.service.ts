import { Injectable, BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';
import * as Joi from '@hapi/joi';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { dbConfig } from '../config/db.config';

export interface Token {
    token?: string;
}

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    /**
     * Creates new user
     * @param username
     * @param email
     * @param password
     */
    async createUser(username: string, email: string, password: string): Promise<Token> {
        const schema = Joi.object().keys({
            username: Joi.string()
                .min(5)
                .max(30)
                .required(),
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                .min(5)
                .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
                .required()
                .messages({
                    'string.empty': `"password" cannot be an empty field`,
                    'string.min': `"password" should have a minimum length of {#limit}`,
                    'string.pattern.base': `password must contain 1 Uppercase character, 1 Lowercase character, 1 special character & 1 number`,
                }),
        });

        const { error, value } = schema.validate({ username, email, password });

        if (error && error.details) {
            throw new BadRequestException({ message: error.details[0].message });
        }

        const userEmail = await this.userModel.findOne({
            email: email.toLowerCase(),
        });
        if (userEmail) {
            throw new ConflictException({ message: 'Email already exists' });
        }

        const userName = await this.userModel.findOne({ username });
        if (userName) {
            throw new ConflictException({ message: 'Username already exists' });
        }

        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    throw new BadRequestException({ message: 'Error hashing password' });
                }

                const body: Partial<User> = {
                    username,
                    email: email.toLowerCase(),
                    password: hash,
                };

                this.userModel.create(body).then((user) => {
                    const token: string = jwt.sign({data: user}, dbConfig.secret, { expiresIn: '48h' });
                    // cookieParser.cookie({ 'auth': token });
                    resolve({ token });
                }).catch(tokenError => {
                    throw new InternalServerErrorException({ message: `Error occured ${tokenError.message.message}` });
                });
            });
        });
    }

    /**
     * Logs in existing user
     * @param email
     * @param password
     */
    async loginUser(email: string, password: string): Promise<Token> {
        return await this.userModel.findOne({ email }).then(user => {
            if (!user) {
                throw new NotFoundException({ message: 'Email not found' });
            }

            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password).then((result) => {
                    if (!result) {
                        throw new InternalServerErrorException({ message: 'Password is incorrect' });
                    }
                    const token: string = jwt.sign({ data: user }, dbConfig.secret, { expiresIn: '48h' });
                    resolve({ token });
                }).catch(tokenError => {
                    reject({ message: `Error occured ${tokenError.message.message}` });
                });
            }).catch(() => {
                throw new InternalServerErrorException({ message: 'Password is incorrect' });
            });

        });
    }
}
