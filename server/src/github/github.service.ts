import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as ghPages from 'gh-pages';
import * as clone from 'git-clone/promise';
import * as del from 'del';
import * as child_process from 'child_process';

import {
    API_URL,
    BUILD_PROJECT_DIRECTORY,
    CLONED_REPOSITORIES_FOLDER_NAME,
    CLONED_REPOSITORIES_FOLDER_PATH,
    GITHUB_BASE_URL,
    ORG_GH_PAGES_URL,
    ORG_NAME,
    ORG_URL,
    SUCCESS_DEPLOY_MESSAGE,
} from './github.constants';

@Injectable()
export class GithubService {

    constructor(
        private readonly configService: ConfigService,
        private httpService: HttpService,
    ) {
    }

    async buildProject(repositoryName: string) {
        const command = `cd ${CLONED_REPOSITORIES_FOLDER_NAME}/${repositoryName} && npm ci && npm run build`;

        return await new Promise<string>((resolve, reject) => {
            child_process.exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    console.log(stderr);
                    reject(err);
                }

                resolve(stdout);
            });
        });
    }

    getRepositoryUrl(repositoryName: string, owner?: string): string {
        if (owner) {
            return `${GITHUB_BASE_URL}/${owner}/${repositoryName}`;
        }

        return `${ORG_URL}/${repositoryName}`;
    }

    async cloneRepository(url: string, name: string, branch: string) {
        try {
            const path = `${CLONED_REPOSITORIES_FOLDER_PATH}/${name}`;
            await del(path);

            await clone(url, path, {
                checkout: branch,
            });
        } catch (err) {
            console.log(err);
            console.error(`Ошибка при удалении ${CLONED_REPOSITORIES_FOLDER_PATH}.`);
        }
    }

    async publishRepository(url: string, name: string): Promise<string> {
        const ACCESS_TOKEN = this.configService.get('GITHUB_ACCESS_TOKEN');

        const [protocol, restUrl] = url.split('://');
        const publishUrl = `${protocol}://${ACCESS_TOKEN}@${restUrl}`;

        return await new Promise<string>((resolve, reject) => {
            ghPages.publish(`${CLONED_REPOSITORIES_FOLDER_PATH}/${name}/${BUILD_PROJECT_DIRECTORY}`, {
                repo: publishUrl,
            }, (err) => {
                if (err) {
                    reject(err.message);
                }

                resolve(SUCCESS_DEPLOY_MESSAGE);
            });
        });
    }

    async createRepository(templateName: string, name: string) {
        const ACCESS_TOKEN = this.configService.get('GITHUB_ACCESS_TOKEN');

        try {
            await lastValueFrom(
                this.httpService.post(`${API_URL.repositories}/${ORG_NAME}/${templateName}/generate`, {
                    name,
                    owner: ORG_NAME,
                }, {
                    headers: {
                        'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    },
                }),
            );

            await this.addHomepageUrlToRepository(name);

            return {
                message: `Репозиторий ${name} создан`,
            }
        } catch (err) {
            throw new Error(`Возникла ошибка при создании репозитория ${name}`);
        }
    }

    async addHomepageUrlToRepository(name: string) {
        const ACCESS_TOKEN = this.configService.get('GITHUB_ACCESS_TOKEN');

        try {
            await lastValueFrom(
                this.httpService.patch(`${API_URL.repositories}/${ORG_NAME}/${name}`, {
                    homepage: `${ORG_GH_PAGES_URL}/${name}`,
                }, {
                    headers: {
                        'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    },
                }),
            );

            return {
                message: `Ссылка добавлена`,
            }
        } catch (err) {
            throw new Error(`Возникла ошибка при добавлении ссылки`);
        }
    }
}
